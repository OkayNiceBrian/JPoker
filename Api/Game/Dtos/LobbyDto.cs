using Api.Game.Helpers;
using Api.Game.Models;

namespace Api.Game.Dtos
{
    public class LobbyDto
    {
        public required string Id { get; set; }
        public bool IsPrivate { get; set; } = true;
        public List<PlayerDto> Players { get; set; } = [];
        public List<Card> Deck { get; set; } = DeckFactory.CreateDeck();
        public List<Card> CommunityCards { get; set; } = [];
        public BettingRound CurrentBettingRound { get; set; } = BettingRound.PreFlop;
        public int Pot { get; set; } = 0;
        public int SmallBlind { get; set; } = 500;
        public int BigBlind { get; set; } = 1000;
        public int ActiveBet { get; set; } = 0;
        public int TurnIndex { get; set; } = 0;
        public int SmallBlindIndex { get; set; } = 0;
        public int TurnTimerSeconds { get; set; } = 30;
    }
}
