using Api.Game.Helpers;
using Api.Game.Models;
using Xunit;

namespace Api.Tests
{
    public class HandSolverTests
    {
        [Fact]
        public void HandSolver_ReturnsWinningPair()
        {
            Lobby mockLobby = new() { 
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

            var players = HandSolver.DetermineWinner(mockLobby);

            Assert.Single(players);
            Assert.Equal("tom", players[0].Username);
        }
    }
}
