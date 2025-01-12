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

            cardPool.Remove(player.Card1!);
            cardPool.Remove(player.Card2!);
        }

        return winningPlayer;
    }
}