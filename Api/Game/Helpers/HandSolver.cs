using Api.Game.Models;

namespace Api.Game.Helpers;

public static class HandSolver
{
    public static Player DetermineWinner(this Lobby lobby)
    {
        var players = lobby.Players;
        var communityCards = lobby.CommunityCards;
        List<Card> cardPool = communityCards.Select(c => c).ToList();

        Player winningPlayer = players[0];
        Hand winningHand = new HighCard(new Rank
        {
            Value = 2,
            ToChar = "2",
            ToString = "two"
        });
        
        foreach(var player in players)
        {
            cardPool.Add(player.Card1!);
            cardPool.Add(player.Card2!);

            // Logic to figure out hands right here :)
            Hand? hand = CheckPairs(cardPool);

            cardPool.Remove(player.Card1!);
            cardPool.Remove(player.Card2!);
        }

        return winningPlayer;
    }

    private static Hand CheckPairs(List<Card> cardPool)
    {
        int maxOccurences = 0;
        Rank maxRank = new()
        {
            Value = 2,
            ToChar = "2",
            ToString = "two"
        };
        for (int i = 0; i < cardPool.Count; i++)
        {
            int occurences = 0;
            Rank? rank = null;
            for (int j = 0; j < cardPool.Count; j++)
            {
                if (cardPool[i].Rank == cardPool[j].Rank)
                {
                    occurences++;
                }
            }
            if (occurences > maxOccurences)
            {
                maxOccurences = occurences;
                maxRank = cardPool[i].Rank;
            } else if (occurences == maxOccurences && rank! > maxRank)
            {
                maxRank = rank!;
            }
        }

        if (maxOccurences == 4)
        {
            return new Quads(maxRank);
        }

        if (maxOccurences == 3 || maxOccurences == 2)
        {
            int maxOccurences2 = 0;
            Rank maxRank2 = new()
            {
                Value = 2,
                ToChar = "2",
                ToString = "two"
            };
            for (int i = 0; i < cardPool.Count; i++)
            {
                int occurences = 0;
                Rank? rank = null;
                for (int j = 0; j < cardPool.Count; j++)
                {
                    if (cardPool[i].Rank == cardPool[j].Rank && cardPool[i].Rank != maxRank)
                    {
                        occurences++;
                    }
                }
                if (occurences > maxOccurences2)
                {
                    maxOccurences2 = occurences;
                    maxRank2 = cardPool[i].Rank;
                }
                else if (occurences == maxOccurences2 && rank! > maxRank2)
                {
                    maxRank2 = rank!;
                }
            }

            if (maxOccurences2 >= 2)
            {
                if (maxOccurences == 3)
                {
                    return new FullHouse(maxRank, maxRank2);
                }
                else
                {
                    return new TwoPair(maxRank, maxRank2);
                }
            }

            return new Pair(maxRank);
        }

        return new HighCard(maxRank);
    }
}