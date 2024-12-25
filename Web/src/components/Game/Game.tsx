import CardPotZone from "./CardPotZone";
import GameControls from "./GameControls";
import PlayerZone from "./PlayerZone";
import "./styles/Game.css";

const Game = () => {

    return (
        <div className="game-container">
            <div className="gameWindow-container">
                <div className="game-table"></div>
                <div className="game-rowOfPlayers">
                    <PlayerZone/>
                    <PlayerZone/>
                    <PlayerZone/>
                </div>
                <div className="game-rowOfPlayers" style={{justifyContent: "space-between"}}>
                    <PlayerZone/>
                    <CardPotZone/>
                    <PlayerZone/>
                </div>
                <div className="game-rowOfPlayers">
                    <PlayerZone/>
                </div>
            </div>
            <GameControls/>
        </div>
    );
};

export default Game;