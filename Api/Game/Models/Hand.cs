using System.Transactions;

namespace Api.Game.Models;

public enum HandType
{
    HighCard,
    Pair,
    TwoPair,
    ThreeOfAKind,
    Straight,
    Flush,
    FullHouse,
    Quads,
    StraightFlush
}

public abstract class Hand
{
    public HandType HandType { get; set; }

    protected Hand(HandType handType)
    {
        HandType = handType;
    }
}

public class HighCard : Hand
{
    public Rank Rank { get; set; }
    
    public HighCard(Rank rank) : base(HandType.HighCard)
    {
        Rank = rank;
    }

    public static bool operator >(HighCard a, HighCard b)
    {
        return a.Rank.Value > b.Rank.Value;
    }
    
    public static bool operator <(HighCard a, HighCard b)
    {
        return a.Rank.Value < b.Rank.Value;
    }
    
    public static bool operator ==(HighCard a, HighCard b)
    {
        return a.Rank.Value == b.Rank.Value;
    }
    
    public static bool operator !=(HighCard a, HighCard b)
    {
        return a.Rank.Value != b.Rank.Value;
    }
}

public class Pair : Hand
{
    public Rank Rank { get; set; }

    public Pair(Rank rank) : base(HandType.Pair)
    {
        Rank = rank;
    }
    
    public static bool operator >(Pair a, Pair b)
    {
        return a.Rank.Value > b.Rank.Value;
    }
    
    public static bool operator <(Pair a, Pair b)
    {
        return a.Rank.Value < b.Rank.Value;
    }
    
    public static bool operator ==(Pair a, Pair b)
    {
        return a.Rank.Value == b.Rank.Value;
    }
    
    public static bool operator !=(Pair a, Pair b)
    {
        return a.Rank.Value != b.Rank.Value;
    }
}

public class TwoPair : Hand
{
    public Rank HighRank { get; set; }
    public Rank LowRank { get; set; }

    public TwoPair(Rank highRank, Rank lowRank) : base(HandType.TwoPair)
    {
        HighRank = highRank;
        LowRank = lowRank;
    }
    
    public static bool operator >(Pair a, Pair b)
    {
        return a.Rank.Value > b.Rank.Value;
    }
    
    public static bool operator <(Pair a, Pair b)
    {
        return a.Rank.Value < b.Rank.Value;
    }
    
    public static bool operator ==(Pair a, Pair b)
    {
        return a.Rank.Value == b.Rank.Value;
    }
    
    public static bool operator !=(Pair a, Pair b)
    {
        return a.Rank.Value != b.Rank.Value;
    }
}

public class ThreeOfAKind : Hand
{
    public Rank Rank { get; set; }

    public ThreeOfAKind(Rank rank) : base(HandType.ThreeOfAKind)
    {
        Rank = rank;
    }
}

public class Straight : Hand
{
    public Rank HighRank { get; set; }

    public Straight(Rank highRank) : base(HandType.Straight)
    {
        HighRank = highRank;
    }
}

public class Flush : Hand
{
    public Rank HighRank { get; set; }

    public Flush(Rank highRank) : base(HandType.Flush)
    {
        HighRank = highRank;
    }
}

public class FullHouse : Hand
{
    public Rank HighRank { get; set; }
    public Rank LowRank { get; set; }

    public FullHouse(Rank highRank, Rank lowRank) : base(HandType.FullHouse)
    {
        HighRank = highRank;
        LowRank = lowRank;
    }
}

public class Quads : Hand
{
    public Rank Rank { get; set; }

    public Quads(Rank rank) : base(HandType.Quads)
    {
        Rank = rank;
    }
}

public class StraightFlush : Hand
{
    public Rank HighRank { get; set; }

    public StraightFlush(Rank highRank) : base(HandType.StraightFlush)
    {
        HighRank = highRank;
    }
}
