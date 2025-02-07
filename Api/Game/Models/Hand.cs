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

    public static bool operator <(Hand a, Hand b)
    {
        if (a is HighCard && b is HighCard)
        {
            return (HighCard)a < (HighCard)b;
        }

        if (a is Pair && b is Pair)
        {
            return (Pair)a < (Pair)b;
        }

        if (a is TwoPair && b is TwoPair)
        {
            return (TwoPair)a < (TwoPair)b;
        }

        if (a is ThreeOfAKind && b is ThreeOfAKind)
        {
            return (ThreeOfAKind)a < (ThreeOfAKind)b;
        }

        if (a is Straight && b is Straight)
        {
            return (Straight)a < (Straight)b;
        }

        if (a is Flush && b is Flush)
        {
            return (Flush)a < (Flush)b;
        }

        if (a is FullHouse && b is FullHouse)
        {
            return (FullHouse)a < (FullHouse)b;
        }

        if (a is Quads && b is Quads)
        {
            return (Quads)a < (Quads)b;
        }

        if (a is StraightFlush && b is StraightFlush)
        {
            return (StraightFlush)a < (StraightFlush)b;
        }

        return false;
    }

    public static bool operator >(Hand a, Hand b)
    {
        if (a is HighCard && b is HighCard)
        {
            return (HighCard)a > (HighCard)b;
        }

        if (a is Pair && b is Pair)
        {
            return (Pair)a > (Pair)b;
        }

        if (a is TwoPair && b is TwoPair)
        {
            return (TwoPair)a > (TwoPair)b;
        }

        if (a is ThreeOfAKind && b is ThreeOfAKind)
        {
            return (ThreeOfAKind)a > (ThreeOfAKind)b;
        }

        if (a is Straight && b is Straight)
        {
            return (Straight)a > (Straight)b;
        }

        if (a is Flush && b is Flush)
        {
            return (Flush)a > (Flush)b;
        }

        if (a is FullHouse && b is FullHouse)
        {
            return (FullHouse)a > (FullHouse)b;
        }

        if (a is Quads && b is Quads)
        {
            return (Quads)a > (Quads)b;
        }

        if (a is StraightFlush && b is StraightFlush)
        {
            return (StraightFlush)a > (StraightFlush)b;
        }

        return false;
    }

    public static bool operator ==(Hand a, Hand b)
    {
        if (a is HighCard && b is HighCard)
        {
            return (HighCard)a == (HighCard)b;
        }

        if (a is Pair && b is Pair)
        {
            return (Pair)a == (Pair)b;
        }

        if (a is TwoPair && b is TwoPair)
        {
            return (TwoPair)a == (TwoPair)b;
        }

        if (a is ThreeOfAKind && b is ThreeOfAKind)
        {
            return (ThreeOfAKind)a == (ThreeOfAKind)b;
        }

        if (a is Straight && b is Straight)
        {
            return (Straight)a == (Straight)b;
        }

        if (a is Flush && b is Flush)
        {
            return (Flush)a == (Flush)b;
        }

        if (a is FullHouse && b is FullHouse)
        {
            return (FullHouse)a == (FullHouse)b;
        }

        if (a is Quads && b is Quads)
        {
            return (Quads)a == (Quads)b;
        }

        if (a is StraightFlush && b is StraightFlush)
        {
            return (StraightFlush)a == (StraightFlush)b;
        }

        return false;
    }

    public static bool operator !=(Hand? a, Hand? b)
    {
        if (a is null && b is null)
        {
            return false;
        }

        if (b is null)
        {
            return true;
        }

        if (a is HighCard && b is HighCard)
        {
            return (HighCard)a != (HighCard)b;
        }

        if (a is Pair && b is Pair)
        {
            return (Pair)a != (Pair)b;
        }

        if (a is TwoPair && b is TwoPair)
        {
            return (TwoPair)a != (TwoPair)b;
        }

        if (a is ThreeOfAKind && b is ThreeOfAKind)
        {
            return (ThreeOfAKind)a != (ThreeOfAKind)b;
        }

        if (a is Straight && b is Straight)
        {
            return (Straight)a != (Straight)b;
        }

        if (a is Flush && b is Flush)
        {
            return (Flush)a != (Flush)b;
        }

        if (a is FullHouse && b is FullHouse)
        {
            return (FullHouse)a != (FullHouse)b;
        }

        if (a is Quads && b is Quads)
        {
            return (Quads)a != (Quads)b;
        }

        if (a is StraightFlush && b is StraightFlush)
        {
            return (StraightFlush)a != (StraightFlush)b;
        }

        return false;
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
    
    public static bool operator >(TwoPair a, TwoPair b)
    {
        if (a.HighRank.Value == b.HighRank.Value)
        {
            return a.LowRank.Value > b.LowRank.Value;
        }
        return a.HighRank.Value > b.HighRank.Value;
    }
    
    public static bool operator <(TwoPair a, TwoPair b)
    {
        if (a.HighRank.Value == b.HighRank.Value)
        {
            return a.LowRank.Value < b.LowRank.Value;
        }
        return a.HighRank.Value < b.HighRank.Value;
    }
    
    public static bool operator ==(TwoPair a, TwoPair b)
    {
        return (a.HighRank.Value == b.HighRank.Value) && (a.LowRank.Value == b.LowRank.Value);
    }
    
    public static bool operator !=(TwoPair a, TwoPair b)
    {
        return !(a.HighRank.Value == b.HighRank.Value) || !(a.LowRank.Value == b.LowRank.Value);
    }
}

public class ThreeOfAKind : Hand
{
    public Rank Rank { get; set; }

    public ThreeOfAKind(Rank rank) : base(HandType.ThreeOfAKind)
    {
        Rank = rank;
    }

    public static bool operator >(ThreeOfAKind a, ThreeOfAKind b)
    {
        return a.Rank.Value > b.Rank.Value;
    }

    public static bool operator <(ThreeOfAKind a, ThreeOfAKind b)
    {
        return a.Rank.Value < b.Rank.Value;
    }

    public static bool operator ==(ThreeOfAKind a, ThreeOfAKind b)
    {
        return a.Rank.Value == b.Rank.Value;
    }

    public static bool operator !=(ThreeOfAKind a, ThreeOfAKind b)
    {
        return a.Rank.Value != b.Rank.Value;
    }
}

public class Straight : Hand
{
    public Rank HighRank { get; set; }

    public Straight(Rank highRank) : base(HandType.Straight)
    {
        HighRank = highRank;
    }

    public static bool operator >(Straight a, Straight b)
    {
        return a.HighRank.Value > b.HighRank.Value;
    }

    public static bool operator <(Straight a, Straight b)
    {
        return a.HighRank.Value < b.HighRank.Value;
    }

    public static bool operator ==(Straight a, Straight b)
    {
        return a.HighRank.Value == b.HighRank.Value;
    }

    public static bool operator !=(Straight a, Straight b)
    {
        return a.HighRank.Value != b.HighRank.Value;
    }
}

public class Flush : Hand
{
    public Rank HighRank { get; set; }

    public Flush(Rank highRank) : base(HandType.Flush)
    {
        HighRank = highRank;
    }

    public static bool operator >(Flush a, Flush b)
    {
        return a.HighRank.Value > b.HighRank.Value;
    }

    public static bool operator <(Flush a, Flush b)
    {
        return a.HighRank.Value < b.HighRank.Value;
    }

    public static bool operator ==(Flush a, Flush b)
    {
        return a.HighRank.Value == b.HighRank.Value;
    }

    public static bool operator !=(Flush a, Flush b)
    {
        return a.HighRank.Value != b.HighRank.Value;
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

    public static bool operator >(FullHouse a, FullHouse b)
    {
        if (a.HighRank.Value == b.HighRank.Value)
        {
            return a.LowRank.Value > b.LowRank.Value;
        }
        return a.HighRank.Value > b.HighRank.Value;
    }

    public static bool operator <(FullHouse a, FullHouse b)
    {
        if (a.HighRank.Value == b.HighRank.Value)
        {
            return a.LowRank.Value < b.LowRank.Value;
        }
        return a.HighRank.Value < b.HighRank.Value;
    }

    public static bool operator ==(FullHouse a, FullHouse b)
    {
        return (a.HighRank.Value == b.HighRank.Value) && (a.LowRank.Value == b.LowRank.Value);
    }

    public static bool operator !=(FullHouse a, FullHouse b)
    {
        return !(a.HighRank.Value == b.HighRank.Value) || !(a.LowRank.Value == b.LowRank.Value);
    }
}

public class Quads : Hand
{
    public Rank Rank { get; set; }

    public Quads(Rank rank) : base(HandType.Quads)
    {
        Rank = rank;
    }

    public static bool operator >(Quads a, Quads b)
    {
        return a.Rank.Value > b.Rank.Value;
    }

    public static bool operator <(Quads a, Quads b)
    {
        return a.Rank.Value < b.Rank.Value;
    }

    public static bool operator ==(Quads a, Quads b)
    {
        return a.Rank.Value == b.Rank.Value;
    }

    public static bool operator !=(Quads a, Quads b)
    {
        return a.Rank.Value != b.Rank.Value;
    }
}

public class StraightFlush : Hand
{
    public Rank HighRank { get; set; }

    public StraightFlush(Rank highRank) : base(HandType.StraightFlush)
    {
        HighRank = highRank;
    }

    public static bool operator >(StraightFlush a, StraightFlush b)
    {
        return a.HighRank.Value > b.HighRank.Value;
    }

    public static bool operator <(StraightFlush a, StraightFlush b)
    {
        return a.HighRank.Value < b.HighRank.Value;
    }

    public static bool operator ==(StraightFlush a, StraightFlush b)
    {
        return a.HighRank.Value == b.HighRank.Value;
    }

    public static bool operator !=(StraightFlush a, StraightFlush b)
    {
        return a.HighRank.Value != b.HighRank.Value;
    }
}
