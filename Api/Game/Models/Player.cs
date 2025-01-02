namespace Api.Game.Models;

public class Player
{
    public required string Username { get; set; }
    public int Chips { get; set; } = 25000;
    public Card? Card1 { get; set; }
    public Card? Card2 { get; set; }
    public int? CurrentBet { get; set; }
    public bool isActive { get; set; } = false;
}