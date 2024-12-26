using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class GameHub : Hub
{
    public GameHub()
    {

    }

    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}