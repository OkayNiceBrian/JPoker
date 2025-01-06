using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using Api.Game.Helpers;
using Api.Game.Models;
using Api.Models;
using Api.Game;

namespace Api.Hubs;

public class GameHub : Hub
{
    ServerContext _ctx;
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
                    Players = [new Player { Username = connection.Username }] 
                }); 
        } else
        {
            _ctx.Lobbies[connection.LobbyId].Players.Add(new Player { Username = connection.Username });
        }

        await Clients.Group(connection.LobbyId)
            .SendAsync("ReceiveMessage", "server", $"{connection.Username} has joined the lobby.");

        var lobby = _ctx.Lobbies[connection.LobbyId];
        if (lobby.Players.Count == 2)
        {
            StartRound(lobby);
        }
        await Clients.Group(connection.LobbyId)
            .SendAsync("ReceiveLobbyInfo", lobby);
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

        if (player == null || !player.isActive || player != lobby.Players[lobby.TurnIndex])
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
    }

    public void StartRound(Lobby lobby)
    {
        var players = lobby.Players;
        // Set all players in lobby to active
        foreach (var player in players)
        {
            player.isActive = true;
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
        MakeBet(bigBlindPlayer, bigBlindBet, lobby); // This sets up the turns as well

        // Set the turnIndex to the player after the big blind (can be small blind with 2 players)
        lobby.TurnIndex = (lobby.SmallBlindIndex + 2) % players.Count;
    }

    public void EndRound(Lobby lobby)
    {
        var players = lobby.Players;

        // Handle chips going into the pot
        int totalChipsAddedToPot = 0;
        foreach (var player in players)
        {
            totalChipsAddedToPot += player.CurrentBet;
            player.Chips -= player.CurrentBet;
            player.CurrentBet = 0;
        }
        lobby.Pot += totalChipsAddedToPot;

        if (lobby.CurrentBettingRound == BettingRound.River)
        {
            // TODO: See who wins the pot
        } else
        {
            // TODO: Handle other Betting Rounds
        }
    }

    public void MakeBet(Player player, int bet, Lobby lobby)
    {
        player.CurrentBet = bet;
        if (lobby.ActiveBet < bet)
        {
            lobby.ActiveBet = bet;
            SetupTurns(lobby);
        }
    }

    public void SetupTurns(Lobby lobby)
    {
        var players = lobby.Players;
        foreach (var player in players)
        {
            if (lobby.ActiveBet == 0 || (lobby.ActiveBet > player.CurrentBet && player.CurrentBet < player.Chips))
            {
                if (!lobby.TurnQueue.Contains(player))
                {
                    lobby.TurnQueue.Enqueue(player);
                }
            }
        }
    }

    public async void NextTurn()
    {

    }
}