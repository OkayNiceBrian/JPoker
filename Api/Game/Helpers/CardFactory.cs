using Api.Game.Models;
using Api.Game.Helpers;

namespace Api.Game.Helpers
{
    public class CardFactory
    {
        public static Card CreateCard(int rank, string suit)
        {
            if (!Types.RankValues.Contains(rank) || !Types.Suits.Contains(suit))
            {
                throw new Exception("Invalid Rank or Suit.");
            }

            int rankIndex = Array.IndexOf(Types.RankValues, rank);
            return new Card() { 
                Suit = suit,
                Rank = new()
                {
                    Value = rank,
                    ToChar = Types.RankChars[rankIndex],
                    ToString = Types.RankStrings[rankIndex]
                }
            };

        }
    }
}
