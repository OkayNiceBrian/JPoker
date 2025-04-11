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
        } else
        {
            _ctx.Lobbies[connection.LobbyId].Players.Add(new Player { Username = connection.Username, ConnectionId = Context.ConnectionId });
        }

        await Clients.Group(connection.LobbyId)
            .SendAsync("ReceiveMessage", "server", $"{connection.Username} has joined the lobby.");

        var lobby = _ctx.Lobbies[connection.LobbyId];
        if (lobby.Players.Count == 2)
        {
            StartGame(lobby);
        }
        
        await ReceiveLobbyInfo(lobby);
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

        if (!Types.GameActions.Contains(action))
        {
            await Clients.Group(connection.LobbyId)
                .SendAsync("ReceiveMessage", "server", "Invalid game action.");
        }

        if (action == "check")
        {
            await Clients.Group(connection.LobbyId)
                .SendAsync("ReceiveMessage", "server", $"{connection.Username} checks.");
        }

        // Dequeue this player at end of turn
        lobby.TurnQueue.Dequeue();
        if (lobby.TurnQueue.Count > 0)
        {
            lobby.TurnIndex = lobby.Players.IndexOf(lobby.TurnQueue.Peek());
        }
        else
        {
            EndRound(lobby);
        }

        await ReceiveLobbyInfo(lobby);
    }

    private static void StartGame(Lobby lobby)
    {
        var players = lobby.Players;
        // Set all players in lobby to active
        foreach (var player in players)
        {
            player.IsActive = true;
        }

        // Set the new small blind player
        lobby.SmallBlindIndex = (lobby.SmallBlindIndex + 1) % players.Count;

        // Small Blind bet
        var smallBlindPlayer = players[lobby.SmallBlindIndex];
        var smallBlindBet = Math.Min(lobby.SmallBlind, smallBlindPlayer.Chips);
        MakeBet(smallBlindPlayer, smallBlindBet, lobby);

        // Big Blind bet
        var bigBlindPlayer = players[(lobby.SmallBlindIndex + 1) % players.Count];
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

    private static void EndRound(Lobby lobby)
    {
        var players = lobby.Players;
        lobby.ActiveBet = 0;

        // Handle chips going into the pot
        int totalChipsAddedToPot = 0;
        foreach (var player in players.Where(p => p.IsActive))
        {
            totalChipsAddedToPot += player.CurrentBet;
            player.Chips -= player.CurrentBet;
            player.CurrentBet = 0;
        }
        lobby.Pot += totalChipsAddedToPot;

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
            var winners = HandSolver.DetermineWinner(lobby);
            foreach(var winner in winners)
            {
                winner.Chips += lobby.Pot / winners.Count();
            }
            lobby.Pot = 0;
            lobby.CommunityCards = [];
            lobby.CurrentBettingRound = 0;
            StartGame(lobby); // Resets game, TODO: should change this so we send winnerInfo to frontend and then waits for frontend to request next round start
            return;
        }

        lobby.CurrentBettingRound++;
        SetupTurns(lobby);
    }

    private static void MakeBet(Player player, int bet, Lobby lobby)
    {
        player.CurrentBet = bet;
        if (lobby.ActiveBet < bet)
        {
            lobby.ActiveBet = bet;
            SetupTurns(lobby);
        }
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