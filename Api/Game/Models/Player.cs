using Api.Game.Dtos;
using System.Runtime.CompilerServices;

namespace Api.Game.Models;

public class Player
{
    public required string Username { get; set; }
    public required string ConnectionId { get; set; }
    public int Chips { get; set; } = 25000;
    public Card? Card1 { get; set; }
    public Card? Card2 { get; set; }
    public int CurrentBet { get; set; } = 0;
    public bool IsActive { get; set; } = false;

    public PlayerDto ToPlayerDto()
    {
        return new PlayerDto()
        {
            Username = this.Username,
            Chips = this.Chips,
            CurrentBet = this.CurrentBet,
            IsActive = this.IsActive,
            Card1 = null,
            Card2 = null
        };
    }
}

