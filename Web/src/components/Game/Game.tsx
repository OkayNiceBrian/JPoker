import { useEffect, useState } from "react";
import { Player } from "@/types/Player";
import CardPotZone from "./CardPotZone";
import GameControls from "./GameControls";
import PlayerZone from "./PlayerZone";
import "./styles/Game.css";

const Game = () => {

    const [player1, setPlayer1] = useState<Player>({name: "JPokerStar", cards: []});

    return (
        <div className="game-container">
            <div className="gameWindow-container">
                <div className="game-table"></div>
                <div className="game-rowOfPlayers">
                    <PlayerZone playerName={player1.name}/>
                    <PlayerZone playerName={player1.name}/>
                    <PlayerZone playerName={player1.name}/>
                </div>
                <div className="game-rowOfPlayers" style={{justifyContent: "space-between"}}>
                    <PlayerZone playerName={player1.name}/>
                    <CardPotZone/>
                    <PlayerZone playerName={player1.name}/>
                </div>
                <div className="game-rowOfPlayers">
                    <PlayerZone playerName={player1.name} card1={{suit: "hearts", rank: {value: 10, toString: "ten", toChar: "10"}}} card2={{suit: "spades", rank: {value: 10, toString: "ten", toChar: "10"}}}/>
                </div>
            </div>
            <GameControls/>
        </div>
    );
};

export default Game;