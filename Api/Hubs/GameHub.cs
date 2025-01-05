using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using Api.Game.Helpers;
using Api.Game.Models;
using Api.Models;

namespace Api.Hubs;

public class GameHub : Hub
{
    public Dictionary<string, Lobby> lobbies;

    public GameHub()
    {
        lobbies = []; 
    }

    public async Task JoinGlobal(UserConnection connection)
    {
        await Clients.All.SendAsync("ReceiveMessage", "server", $"{connection.Username} has joined.");
    }

    public async Task JoinLobby(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.LobbyId);
        
        // If lobby doesn't exist, create it.
        if (!lobbies.ContainsKey(connection.LobbyId))
        {
            lobbies.Add(connection.LobbyId, 
                new Lobby { 
                    Id = connection.LobbyId, 
                    IsPrivate = false, 
                    Players = [new Player { Username = connection.Username }] 
                }); 
        }

        await Clients.Group(connection.LobbyId)
            .SendAsync("ReceiveMessage", "server", $"{connection.Username} has joined the lobby.");
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