using Api.Game.Models;

namespace Api.Game.Dtos
{
    public class PlayerDto
    {
        public required string Username { get; set; }
        public int Chips { get; set; }
        public int CurrentBet { get; set; }
        public bool IsActive { get; set; }
        public Card? Card1 { get; set; }
        public Card? Card2 { get; set; }
    }
}
