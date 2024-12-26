namespace Api.Game.Models;

public class Card
{
    public required string Suit { get; set; }
    public required Rank Rank { get; set; }
}