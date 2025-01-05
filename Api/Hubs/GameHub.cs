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
        await Clients.Group(connection.LobbyId)
            .SendAsync("ReceivePlayers", lobby.Players);
    }

    public async Task SendMessage(UserConnection connection, string message)
    {
        await Clients.Group(connection.LobbyId).SendAsync("ReceiveMessage", connection.Username, message);
    }

    // GAME
    // =============================
    public async Task GameAction(UserConnection connection, string action)
    {
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
    }

    public void NextTurn()
    {

    }
}