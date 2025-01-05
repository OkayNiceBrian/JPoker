using Api.Game.Models;

namespace Api.Game
{
    public class ServerContext
    {
        public Dictionary<string, Lobby> lobbies;

        public ServerContext()
        {
            lobbies = [];
        }
    }
}
