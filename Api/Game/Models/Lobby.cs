using Api.Game.Helpers;
using System.ComponentModel.DataAnnotations;

namespace Api.Game.Models;

public class Lobby
{
    public required string Id { get; set; }
    public bool IsPrivate { get; set; } = true;
    public List<Player> Players { get; set; } = [];
    public List<Card> Deck { get; set; } = CardFactory.CreateDeck();
    public List<Card> CommunityCards { get; set; } = [];
    public int Pot { get; set; } = 0;
    public int CurrentBet { get; set; } = 0;
    public int TurnIndex { get; set; } = 0;
    public int TurnTimerSeconds { get; set; } = 30;
}