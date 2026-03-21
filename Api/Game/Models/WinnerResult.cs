namespace Api.Game.Models
{
    public class WinnerResult
    {
        public List<Player> Winners { get; set; } = [];
        public Hand WinningHand { get; set; } = new HighCard(new Rank
        {
            Value = 2,
            ToChar = "2",
            ToString = "2"
        });
    }
}
