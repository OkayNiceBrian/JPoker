using System.Numerics;

namespace Api.Game.Models;

public class Rank
{
    public int Value { get; set; }
    public string ToString { get; set; }
    public string ToChar { get; set; }

    public static bool operator >(Rank a, Rank b)
    {
        return a.Value > b.Value;
    }

    public static bool operator <(Rank a, Rank b)
    {
        return a.Value < b.Value;
    }

    public static bool operator ==(Rank? a, Rank? b)
    {
        if (a == null && b == null)
        {
            return true;
        } 
        else if (a == null || b == null)
        {
            return false;
        }

        return a.Value == b.Value;
    }

    public static bool operator !=(Rank? a, Rank? b)
    {
        if (b == null || a == null)
        {
            return true;
        }

        return a.Value != b.Value;
    }
}