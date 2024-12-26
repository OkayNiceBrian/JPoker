using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using Api.Game.Helpers;
using Api.Game.Models;

namespace Api.Hubs;

public class GameHub : Hub
{
    public List<Card> deck;
    public GameHub()
    {
        deck = CardFactory.CreateDeck();
    }

    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}