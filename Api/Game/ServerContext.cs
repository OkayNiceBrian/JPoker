using Api.Game.Models;

namespace Api.Game
{
    public class ServerContext
    {
        public Dictionary<string, Lobby> Lobbies { get; set; } = [];
    }
}
