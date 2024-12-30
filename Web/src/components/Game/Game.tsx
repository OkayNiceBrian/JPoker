import { useEffect, useState } from "react";
import * as signalr from "@microsoft/signalr";
import { Player } from "@/types/Player";
import { Card } from "@/types/Card";
import CardPotZone from "./CardPotZone";
import GameControls from "./GameControls";
import PlayerZone from "./PlayerZone";
import "@/App.css";
import "@/index.css";
import "./styles/Game.css";

const Game = () => {
    const [player1, setPlayer1] = useState<Player>({name: "JPokerStar", cards: [], chips: 10500});
    const [communityCards, setCommunityCards] = useState<Card[]>([]);
    const [potTotal, setPotTotal] = useState<number>(1296400);
    const [send, setSend] = useState<boolean>(false);

    useEffect(() => { // SignalR WebSockets
        const connection = new signalr.HubConnectionBuilder()
            .withUrl("https://localhost:44392/gameHub")
            .build();

        connection.start().catch((e) => console.error(e));

        connection.on("ReceiveMessage", (username: string, message: string) => {
            console.log(username + ": " + message);
        });

        if (send) {
            JoinLobby();
        }

        function JoinLobby() {
            connection.send("JoinLobby", { username: "JPokerStar", lobbyId: "3174" });
            setSend(false);
        }
    });

    useEffect(() => {
        setCommunityCards([
            {
                suit: "spades",
                rank: {
                    value: 14,
                    toChar: "A",
                    toString: "ace",
                }
            },
            {
                suit: "hearts",
                rank: {
                    value: 7,
                    toChar: "7",
                    toString: "seven",
                }
            },
            {
                suit: "clubs",
                rank: {
                    value: 12,
                    toChar: "Q",
                    toString: "queen",
                }
            },
        ]);
    }, []);

    return (
        <div className="game-container">
            <div className="gameWindow-container">
                <div className="game-table"></div>
                <div className="game-rowOfPlayers">
                    <PlayerZone playerName={player1.name} chips={player1.chips}/>
                    <PlayerZone playerName={player1.name} chips={player1.chips}/>
                    <PlayerZone playerName={player1.name} chips={player1.chips}/>
                </div>
                <div className="game-rowOfPlayers" style={{justifyContent: "space-between"}}>
                    <PlayerZone playerName={player1.name} chips={player1.chips}/>
                    <CardPotZone potTotal={potTotal} communityCards={communityCards}/>
                    <PlayerZone playerName={player1.name} chips={player1.chips}/>
                </div>
                <div className="game-rowOfPlayers">
                    <PlayerZone playerName={player1.name} chips={player1.chips} card1={{suit: "hearts", rank: {value: 10, toString: "ten", toChar: "10"}}} card2={{suit: "spades", rank: {value: 10, toString: "ten", toChar: "10"}}}/>
                </div>
            </div>
            <GameControls button1={setSend} />
        </div>
    );
};

export default Game;