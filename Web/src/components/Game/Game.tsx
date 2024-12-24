import GameControls from "./GameControls";
import "./styles/Game.css";

const Game = () => {

    

    return (
        <div className="game-container">
            <div className="gameWindow-container">
                <div className="game-table"></div>
            </div>
            <GameControls/>
        </div>
    );
};

export default Game;