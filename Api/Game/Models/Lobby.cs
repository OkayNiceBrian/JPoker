using System.ComponentModel.DataAnnotations;

namespace Api.Game.Models;

public class Lobby
{
    public required string Id { get; set; }
    public bool IsPrivate { get; set; } = true;
    public List<Player> Players { get; set; } = [];
}