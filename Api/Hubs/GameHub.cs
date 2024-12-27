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

    public async Task SendMessage(UserConnection connection, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", connection.Username, message);
    }
}