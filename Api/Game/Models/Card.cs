namespace Api.Game.Models;

public class Card : IComparable<Card>
{
    public required string Suit { get; set; }
    public required Rank Rank { get; set; }

    public int CompareTo(Card? that)
    {
        if (that == null)
        {
            return -1;
        }

        return this.Rank.Value - that.Rank.Value;
    }
}