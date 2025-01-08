using Api.Game.Dtos;
using Api.Game.Helpers;

namespace Api.Game.Models;

public enum BettingRound
{
    PreFlop = 0,
    Flop,
    Turn,
    River
};

public class Lobby
{
    public required string Id { get; set; }
    public bool IsPrivate { get; set; } = true;
    public List<Player> Players { get; set; } = [];
    public List<Card> Deck { get; set; } = DeckFactory.CreateDeck();
    public List<Card> CommunityCards { get; set; } = [];
    public BettingRound CurrentBettingRound { get; set; } = BettingRound.PreFlop;
    public int Pot { get; set; } = 0;
    public int SmallBlind { get; set; } = 500;
    public int BigBlind { get; set; } = 1000;
    public int ActiveBet { get; set; } = 0;
    public Queue<Player> TurnQueue { get; set; } = [];
    public int TurnIndex { get; set; } = 0;
    public int SmallBlindIndex { get; set; } = 0;
    public int TurnTimerSeconds { get; set; } = 30;

    public LobbyDto ToLobbyDto()
    {
        return new LobbyDto()
        {
            Id = this.Id,
            ActiveBet = this.ActiveBet,
            BigBlind = this.BigBlind,
            CommunityCards = this.CommunityCards,
            CurrentBettingRound = this.CurrentBettingRound,
            IsPrivate = this.IsPrivate,
            Players = this.Players.Select<Player, PlayerDto>(p => p.ToPlayerDto()).ToList(),
            Pot = this.Pot,
            SmallBlind = this.SmallBlind,
            SmallBlindIndex = this.SmallBlindIndex,
            TurnIndex = this.TurnIndex,
            TurnTimerSeconds = this.TurnTimerSeconds,
        };
    }
}