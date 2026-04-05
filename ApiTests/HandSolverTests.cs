using Api.Game.Helpers;
using Api.Game.Models;
using System.Numerics;
using Xunit;

namespace Api.Tests
{
    public class HandSolverTests
    {
        [Fact]
        public void HandSolver_ReturnsWinningPair()
        {
            Lobby mockLobby = new()
            {
                Id = "1",
                CommunityCards = [
                    CardFactory.CreateCard(2, "diamonds"),
                    CardFactory.CreateCard(5, "clubs"),
                    CardFactory.CreateCard(7, "spades"),
                    CardFactory.CreateCard(11, "hearts"),
                    CardFactory.CreateCard(8, "clubs")
                ],
                Players = [
                    new Player() {
                        ConnectionId = "1",
                        Username = "brian",
                        IsActive = true,
                        Card1 = CardFactory.CreateCard(2, "spades"),
                        Card2 = CardFactory.CreateCard(13, "diamonds"),
                    },
                    new Player() {
                        ConnectionId = "1",
                        Username = "tom",
                        IsActive = true,
                        Card1 = CardFactory.CreateCard(7, "diamonds"), // Winner, High Pair
                        Card2 = CardFactory.CreateCard(3, "clubs"),
                    }
                ]
            };

            var winnerResult = HandSolver.DetermineWinner(mockLobby);
            Assert.Single(winnerResult.Winners);
            Assert.Equal("tom", winnerResult.Winners[0].Username);

            mockLobby.Players[0].Card1 = CardFactory.CreateCard(11, "spades"); // New High Pair

            winnerResult = HandSolver.DetermineWinner(mockLobby);
            Assert.Single(winnerResult.Winners);
            Assert.Equal("brian", winnerResult.Winners[0].Username);
        }

        [Fact]
        public void HandSolver_ReturnsWinningTwoPair()
        {
            Lobby mockLobby = new()
            {
                Id = "1",
                CommunityCards = [
                    CardFactory.CreateCard(2, "diamonds"),
                    CardFactory.CreateCard(5, "clubs"),
                    CardFactory.CreateCard(7, "spades"),
                    CardFactory.CreateCard(11, "hearts"),
                    CardFactory.CreateCard(8, "clubs")
                ],
                Players = [
                    new Player() {
                        ConnectionId = "1",
                        Username = "brian",
                        IsActive = true,
                        Card1 = CardFactory.CreateCard(2, "spades"),
                        Card2 = CardFactory.CreateCard(13, "diamonds"),
                    },
                    new Player() {
                        ConnectionId = "1",
                        Username = "tom",
                        IsActive = true,
                        Card1 = CardFactory.CreateCard(8, "diamonds"), // Winner, Two Pair VS Pair
                        Card2 = CardFactory.CreateCard(5, "clubs"),    //
                    }
                ]
            };

            var wr = HandSolver.DetermineWinner(mockLobby);
            Assert.Single(wr.Winners);
            Assert.Equal("tom", wr.Winners[0].Username);

            mockLobby.Players.First(p => p.Username == "brian").Card2 = CardFactory.CreateCard(11, "spades"); // Higher Two Pair

            wr = HandSolver.DetermineWinner(mockLobby);
            Assert.Single(wr.Winners);
            Assert.Equal("brian", wr.Winners[0].Username);
        }

        [Fact]
        public void HandSolver_ReturnsWinningStraight()
        {
            Player brian = new Player()
            {
                ConnectionId = "1",
                Username = "brian",
                IsActive = true,
                Card1 = CardFactory.CreateCard(3, "spades"),
                Card2 = CardFactory.CreateCard(4, "diamonds"), // Two Pair
            };
            Player tom = new Player()
            {
                ConnectionId = "1",
                Username = "tom",
                IsActive = true,
                Card1 = CardFactory.CreateCard(5, "diamonds"), // Winner, Straight VS Two Pair
                Card2 = CardFactory.CreateCard(10, "clubs"),
            };

            Lobby mockLobby = new()
            {
                Id = "1",
                CommunityCards = [
                    CardFactory.CreateCard(2, "diamonds"),
                    CardFactory.CreateCard(3, "clubs"),
                    CardFactory.CreateCard(4, "spades"),
                    CardFactory.CreateCard(9, "hearts"),
                    CardFactory.CreateCard(Types.RankValues.Last(), "clubs") // ACE
                ],
                Players = [
                    brian,
                    tom
                ]
            };

            var wr = HandSolver.DetermineWinner(mockLobby); // straight beats a two pair
            Assert.Single(wr.Winners);
            Assert.Equal("tom", wr.Winners[0].Username);

            brian.Card1 = CardFactory.CreateCard(5, "spades"); // Higher Straight
            brian.Card2 = CardFactory.CreateCard(6, "spades"); // 
            wr = HandSolver.DetermineWinner(mockLobby);   // Beats Straight
            Assert.Single(wr.Winners);
            Assert.Equal("brian", wr.Winners[0].Username);

            tom.Card1 = CardFactory.CreateCard(9, "spades");
            tom.Card2 = CardFactory.CreateCard(9, "diamonds"); // Three of a kind
            wr = HandSolver.DetermineWinner(mockLobby);
            Assert.Single(wr.Winners);
            Assert.Equal("brian", wr.Winners[0].Username); // Straight beats 3 of a kind
        }

        [Fact]
        public void HandSolver_ReturnsWinningFlush()
        {
            Player brian = new Player()
            {
                ConnectionId = "1",
                Username = "brian",
                IsActive = true,
                Card1 = CardFactory.CreateCard(3, "spades"),
                Card2 = CardFactory.CreateCard(11, "spades"), // Flush
            };
            Player tom = new Player()
            {
                ConnectionId = "1",
                Username = "tom",
                IsActive = true,
                Card1 = CardFactory.CreateCard(8, "diamonds"), // high card
                Card2 = CardFactory.CreateCard(10, "spades"),
            };

            Lobby mockLobby = new()
            {
                Id = "1",
                CommunityCards = [
                    CardFactory.CreateCard(7, "spades"),
                    CardFactory.CreateCard(2, "spades"),
                    CardFactory.CreateCard(4, "spades"),
                    CardFactory.CreateCard(3, "hearts"),
                    CardFactory.CreateCard(Types.RankValues.Last(), "clubs")
                ],
                Players = [
                    brian,
                    tom
                ]
            };

            var wr = HandSolver.DetermineWinner(mockLobby); // Flush beats a high card
            Assert.Single(wr.Winners);
            Assert.Equal("brian", wr.Winners[0].Username);

            tom.Card1 = CardFactory.CreateCard(5, "spades"); // 
            tom.Card2 = CardFactory.CreateCard(12, "spades"); //  Higher Flush
            wr = HandSolver.DetermineWinner(mockLobby);   // 
            Assert.Single(wr.Winners);
            Assert.Equal("tom", wr.Winners[0].Username);


            brian.Card1 = CardFactory.CreateCard(6, "hearts");
            brian.Card2 = CardFactory.CreateCard(5, "diamonds"); // Straight
            wr = HandSolver.DetermineWinner(mockLobby);   // 
            Assert.Single(wr.Winners);
            Assert.Equal("tom", wr.Winners[0].Username); // Flush beats a straight
        }
    }
}

