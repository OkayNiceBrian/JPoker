using Api.Game.Models;

namespace Api.Game.Helpers;

public static class HandSolver
{
    public static List<Player> DetermineWinner(this Lobby lobby)
    {
        var players = lobby.Players;
        var communityCards = lobby.CommunityCards;
        List<Card> cardPool = communityCards.Select(c => c).ToList();

        List<Player> winningPlayers = [];
        Hand winningHand = new HighCard(new Rank
        {
            Value = 2,
            ToChar = "2",
            ToString = "two"
        });

        foreach (var player in players.Where(p => p.IsActive).ToList())
        {
            cardPool.Add(player.Card1!);
            cardPool.Add(player.Card2!);

            // Logic to figure out hands right here :)
            Hand? hand = CheckPairs(cardPool);
            Hand? tempHand = CheckStraight(cardPool);
            if (tempHand is not null && tempHand.HandType > hand.HandType)
            {
                hand = tempHand;
            }

            if (hand.HandType < HandType.Flush)
            {
                tempHand = CheckFlush(cardPool);
                if (tempHand is not null)
                {
                    hand = tempHand; 
                }
            }

            // Figure out the currently winning player
            if (hand.HandType > winningHand.HandType || (hand.HandType == winningHand.HandType && hand > winningHand))
            {
                winningPlayers.Clear();
                winningPlayers.Add(player);
                winningHand = hand;
            } else if (hand.HandType == winningHand.HandType && hand == winningHand) // TODO: Not sure if this compares by reference but I think it's good
            {
                winningPlayers.Add(player);
            }

            cardPool.Remove(player.Card1!);
            cardPool.Remove(player.Card2!);
        }

        return winningPlayers;
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
            Rank? rank = cardPool[i].Rank;
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
            } else if (occurences == maxOccurences && rank > maxRank)
            {
                maxRank = rank;
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
                Rank? rank = cardPool[i].Rank;
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
                else if (occurences == maxOccurences2 && rank > maxRank2)
                {
                    maxRank2 = rank;
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
            } else if (maxOccurences == 3)
            {
                return new ThreeOfAKind(maxRank);
            }

            return new Pair(maxRank);
        }

        return new HighCard(maxRank);
    }

    private static Hand? CheckStraight(List<Card> cardPool)
    {
        cardPool.Sort();

        Rank? highestRank = null;
        int sequence = 1;
        int flushSequence = 1;
        bool straightFlush = false;
        for (int i = 0; i <= 2; i++)
        {
            for (int j = i + 1; j < i + 5; j++)
            {
                if (cardPool[j - 1].Rank.Value == cardPool[j].Rank.Value - 1)
                 {
                    sequence++;
                    if (cardPool[j - 1].Suit == cardPool[j].Suit)
                    {
                        flushSequence++;
                    }
                    if (sequence == 5)
                    {
                        if (flushSequence >= 5)
                        {
                            straightFlush = true;
                        }

                        if (flushSequence < 5 && straightFlush)
                        {
                            return new StraightFlush(highestRank!);
                        }

                        highestRank = cardPool[j].Rank;
                    }
                }
            } 

            if (cardPool[i].Rank.Value == 2 && cardPool[cardPool.Count - 1].Rank.ToChar == "A" && sequence == 4)
            {
                highestRank = cardPool[i + 3].Rank;
            }
            
            sequence = 1;
            flushSequence = 1;
        }

        if (highestRank is not null)
        {
            return new Straight(highestRank);
        }

        if (highestRank is not null && straightFlush == true)
        {
            return new StraightFlush(highestRank);
        }

        return null;
    }

    private static Hand? CheckFlush(List<Card> cardPool)
    {
        cardPool.Sort();
        Rank? highestRank = null;
        Rank? highestRankFlush = null;
        int flushSequence = 1;
        int highestFlushSequence = 1;
        for (int i = 0; i <= 2; i++)
        {
            highestRank = cardPool[i].Rank;
            for (int j = i + 1; j < cardPool.Count; j++)
            {
                if (cardPool[j].Suit == cardPool[i].Suit)
                {
                    flushSequence++;
                    if (cardPool[j].Rank > highestRank!)
                    {
                        highestRank = cardPool[j].Rank;
                    }
                }
            }

            if (flushSequence > highestFlushSequence)
            {
                highestFlushSequence = flushSequence;
            }
            if (flushSequence == 5)
            {
                highestRankFlush = highestRank;
            }
            flushSequence = 1;
        }

        if (highestFlushSequence >= 5)
        {
            return new Flush(highestRankFlush!);
        }

        return null;
    }
}