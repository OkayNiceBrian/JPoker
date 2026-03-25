using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using Api.Game.Helpers;
using Api.Game.Models;
using Api.Models;
using Api.Game;
using Newtonsoft.Json;
using Api.Game.Dtos;

namespace Api.Hubs;

public class GameHub : Hub
{
    private readonly ServerContext _ctx;
    public GameHub(ServerContext ctx)
    {
        _ctx = ctx;
    }

    // Server Tasks
    // ====================
    public async Task JoinGlobal(UserConnection connection)
    {
        await Clients.All.SendAsync("ReceiveMessage", "server", $"{connection.Username} has joined.");
    }

    public async Task JoinLobby(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.LobbyId);

        // If lobby doesn't exist, create it.
        if (!_ctx.Lobbies.ContainsKey(connection.LobbyId))
        {
            _ctx.Lobbies.Add(connection.LobbyId,
                new Lobby {
                    Id = connection.LobbyId,
                    IsPrivate = false,
                    Players = [new Player { Username = connection.Username, ConnectionId = Context.ConnectionId }]
                });
        } else if (!_ctx.Lobbies[connection.LobbyId].Players.Select(p => p.Username).Contains(connection.Username))
        {
            _ctx.Lobbies[connection.LobbyId].Players.Add(new Player { Username = connection.Username, ConnectionId = Context.ConnectionId });
        } else
        {
            _ctx.Lobbies[connection.LobbyId].Players.First(p => p.Username == connection.Username).ConnectionId = Context.ConnectionId;
        }

        await Clients.Group(connection.LobbyId)
            .SendAsync("ReceiveMessage", "server", $"{connection.Username} has joined the lobby.");

        var lobby = _ctx.Lobbies[connection.LobbyId];
        
        await ReceiveLobbyInfo(lobby);
    }

    public async Task GetLobbies()
    {
        await Clients.Client(Context.ConnectionId)
            .SendAsync("ReceiveLobbies", _ctx.Lobbies.Where(l => !l.Value.IsPrivate).Select(l => new
            {
                LobbyId = l.Value.Id,
                PlayerCount = l.Value.Players.Count
            }).ToList());
    }

    public async Task SendMessage(UserConnection connection, string message)
    {
        await Clients.Group(connection.LobbyId).SendAsync("ReceiveMessage", connection.Username, message);
    }

    // Game Tasks
    // =============================
    public async Task GameAction(UserConnection connection, string action)
    {
        var lobby = _ctx.Lobbies[connection.LobbyId];
        var player = lobby.Players.Where(p => p.Username == connection.Username).FirstOrDefault();

        if (player == null || !player.IsActive || player != lobby.Players[lobby.TurnIndex])
            return;

        //if (!Types.GameActions.Contains(action))
        //{
        //    await Clients.Group(connection.LobbyId)
        //        .SendAsync("ReceiveMessage", "server", "Invalid game action.");
        //}

        if (action == "check")
        {
            await Clients.Group(connection.LobbyId)
                .SendAsync("ReceiveMessage", "server", $"{connection.Username} checks.");
        }

        if (action == "fold")
        {
            player.IsActive = false;
            await Clients.Group(connection.LobbyId)
                .SendAsync("ReceiveMessage", "server", $"{connection.Username} folds.");
            if (lobby.Players.Select(p => p.IsActive).Count() == 1)
            {
                await EndRound(lobby);
            }
        }

        if (action == "call")
        {
            if (player.Chips >= lobby.ActiveBet)
            {
                player.CurrentBet = lobby.ActiveBet;
                player.Chips -= lobby.ActiveBet;
                lobby.Pot += lobby.ActiveBet;
            }
        }

        if (action.StartsWith("bet"))
        {
            int bet = int.Parse(action.Split(" ")[1]);
            MakeBet(player, bet, lobby);
        }

        if (action.StartsWith("raise"))
        {
            int raise = int.Parse(action.Split(" ")[1]);
            MakeRaise(player, raise, lobby);
        }

        if (action == "all in")
        {
            player.CurrentBet += player.Chips;
            player.Chips = 0;
            lobby.ActiveBet = player.CurrentBet;
            lobby.Pot += lobby.ActiveBet;
            SetupTurns(lobby);
        }

        // Dequeue this player at end of turn
        lobby.TurnQueue.Dequeue();
        if (lobby.TurnQueue.Count > 0)
        {
            lobby.TurnIndex = lobby.Players.IndexOf(lobby.TurnQueue.Peek());
        }
        else
        {
            await EndRound(lobby);
        }

        await ReceiveLobbyInfo(lobby);
    }

    public async Task StartGame(UserConnection connection, string action)
    {
        StartGame(_ctx.Lobbies[connection.LobbyId]);
    }

    private static void StartGame(Lobby lobby)
    {
        var players = lobby.Players;
        // Set all players in lobby to active
        foreach (var player in players)
        {
            player.IsActive = true;
        }

        // Set the new dealer, small blind player, big blind player
        lobby.DealerIndex = lobby.SmallBlindIndex;
        lobby.SmallBlindIndex = (lobby.SmallBlindIndex + 1) % players.Count;
        lobby.BigBlindIndex = (lobby.SmallBlindIndex + 1) % players.Count;

        // Small Blind bet
        var smallBlindPlayer = players[lobby.SmallBlindIndex];
        var smallBlindBet = Math.Min(lobby.SmallBlind, smallBlindPlayer.Chips);
        MakeBet(smallBlindPlayer, smallBlindBet, lobby);

        // Big Blind bet
        var bigBlindPlayer = players[lobby.BigBlindIndex];
        var bigBlindBet = Math.Min(lobby.BigBlind, bigBlindPlayer.Chips);
        MakeBet(bigBlindPlayer, bigBlindBet, lobby);

        // Deal Cards
        lobby.Deck = DeckFactory.CreateDeck(); // Shuffles as well
        foreach (var player in players.Where(p => p.IsActive)) {
            player.Card1 = lobby.Deck.PopCard();
            player.Card2 = lobby.Deck.PopCard();
        }

        // Set the turnIndex to the player after the big blind (can be small blind with 2 players)
        lobby.TurnIndex = (lobby.SmallBlindIndex + 2) % players.Count;
        lobby.TurnQueue.Clear();
        SetupTurns(lobby);
    }

    private async Task EndRound(Lobby lobby)
    {
        var players = lobby.Players;
        lobby.ActiveBet = 0;

        List<Player> activePlayers = players.Where(p => p.IsActive).ToList();

        foreach (var player in players)
        {
            player.CurrentBet = 0;
        }

        if (activePlayers.Count() == 1)
        {
            await settleWinnings(lobby, new WinnerResult
            { 
                Winners = activePlayers
            });
            return;
        }

        if (lobby.CurrentBettingRound == BettingRound.PreFlop)
        {
            lobby.CommunityCards.Add(lobby.Deck.PopCard()!);
            lobby.CommunityCards.Add(lobby.Deck.PopCard()!);
            lobby.CommunityCards.Add(lobby.Deck.PopCard()!);
        }
        else if (lobby.CurrentBettingRound == BettingRound.Flop || lobby.CurrentBettingRound == BettingRound.Turn)
        {
            lobby.CommunityCards.Add(lobby.Deck.PopCard()!);
        }
        else if (lobby.CurrentBettingRound == BettingRound.River)
        {
            var winnerResult = HandSolver.DetermineWinner(lobby);
            await settleWinnings(lobby, winnerResult);

            return;
        }

        lobby.CurrentBettingRound++;
        SetupTurns(lobby);
    }

    private async Task settleWinnings(Lobby lobby, WinnerResult wr)
    {
        foreach (var winner in wr.Winners)
        {
            winner.Chips += lobby.Pot / wr.Winners.Count();

            await Clients.Group(lobby.Id)
                .SendAsync("ReceiveMessage", "server", $"{winner.Username} wins the pot with a {wr.WinningHand.ToString()}.");
        }
        lobby.Pot = 0;
        lobby.CurrentBettingRound = 0;
        await Clients.Group(lobby.Id)
            .SendAsync("ReceiveWinner", lobby, wr);

        Thread.Sleep(5000); // Sleep for five seconds, this is probably wrong loL!
        lobby.CommunityCards = [];
        StartGame(lobby); // Resets game
    }

    private static void MakeBet(Player player, int bet, Lobby lobby)
    {
        player.CurrentBet = bet;
        if (lobby.ActiveBet < bet)
        {
            lobby.ActiveBet = bet;
        }
        player.Chips -= bet;
        lobby.Pot += bet;
        SetupTurns(lobby);
    }

    private static void MakeRaise(Player player, int raise, Lobby lobby)
    {
        lobby.ActiveBet += raise;
        player.Chips -= (lobby.ActiveBet - player.CurrentBet);
        player.CurrentBet = lobby.ActiveBet;
        lobby.Pot += raise;
        SetupTurns(lobby);
    }

    private static void SetupTurns(Lobby lobby)
    {
        var players = lobby.Players;
        foreach (var player in players.Where(p => p.IsActive))
        {
            if (lobby.ActiveBet == 0 || (lobby.ActiveBet > player.CurrentBet && player.CurrentBet < player.Chips))
            {
                if (!lobby.TurnQueue.Contains(player))
                {
                    lobby.TurnQueue.Enqueue(player);
                }
            }
        }
        lobby.TurnIndex = players.IndexOf(lobby.TurnQueue.Peek());
    }

    private async Task ReceiveLobbyInfo(Lobby lobby)
    {
        var lobbyDto = lobby.ToLobbyDto();
        foreach (var player in lobby.Players)
        {
            lobbyDto.Players.Where(p => p.Username == player.Username).First().Card1 = player.Card1;
            lobbyDto.Players.Where(p => p.Username == player.Username).First().Card2 = player.Card2;

            await Clients.Client(player.ConnectionId)
                .SendAsync("ReceiveLobbyInfo", lobbyDto);

            lobbyDto.Players.Where(p => p.Username == player.Username).First().Card1 = null;
            lobbyDto.Players.Where(p => p.Username == player.Username).First().Card2 = null;
        }
    } 

    private async Task ReceiveResults(Lobby lobby)
    {

    }
}