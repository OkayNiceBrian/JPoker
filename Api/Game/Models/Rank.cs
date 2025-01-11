using System.Numerics;

namespace Api.Game.Models;

public class Rank : IComparable<Rank>
{
    public int Value { get; set; }
    public string ToString { get; set; }
    public string ToChar { get; set; }

    public int CompareTo(Rank? that)
    {
        if (that == null)
        {
            return 1;
        }
        return this.Value - that.Value;
    }
}