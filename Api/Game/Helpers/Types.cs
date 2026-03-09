namespace Api.Game.Helpers
{
    public static class Types
    {
        public static string[] GameActions = ["check", "call", "bet", "raise", "fold", "allIn"];
        public static readonly string[] Suits =
        [
            "hearts",
            "diamonds",
            "spades",
            "clubs"
        ];
        public static readonly int[] RankValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        public static readonly string[] RankChars = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        public static readonly string[] RankStrings =
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
    }
}
