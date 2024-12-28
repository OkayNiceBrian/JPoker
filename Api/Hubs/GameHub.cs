using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using Api.Game.Helpers;
using Api.Game.Models;
using Api.Models;

namespace Api.Hubs;

public class GameHub : Hub
{
    public List<Card> deck;
    public GameHub()
    {
        this.deck = CardFactory.CreateDeck();
    }

    public async Task JoinGlobal(UserConnection connection)
    {
        await Clients.All.SendAsync("ReceiveMessage", "admin", $"{connection.Username} has joined.");
    }

    public async Task JoinLobby(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.LobbyId);
        await Clients.Group(connection.LobbyId)
            .SendAsync("ReceiveMessage", "admin", $"{connection.Username} has joined the lobby.");
    }
    public async Task SendMessage(UserConnection connection, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", connection.Username, message);
    }
}