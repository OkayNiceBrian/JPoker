using System.Collections.Generic;
using Api.Game.Models;

namespace Api.Game.Helpers;

public static class CardFactory
{
    private static readonly int RankCount = 13;
    private static readonly string[] Suits =
    [
        "hearts",
        "diamonds",
        "spades",
        "clubs"
    ];
    private static readonly int[] RankValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    private static readonly string[] RankChars = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    private static readonly string[] RankStrings =
    [
        "deuce",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "jack",
        "queen",
        "king",
        "ace"
    ];
    
    public static List<Card> CreateDeck()
    {
        List<Card> deck = [];

        foreach (string suit in Suits)
        {
            for (int i = 0; i < RankCount; i++)
            {
                deck.Add(new Card
                {
                    Suit = suit,
                    Rank = new Rank
                    {
                        Value = RankValues[i],
                        ToString = RankStrings[i],
                        ToChar = RankChars[i]
                    }
                });
            }
        }
        
        return deck;
    }
}