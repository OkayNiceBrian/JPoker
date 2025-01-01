import { useEffect, useState } from "react";
import * as signalr from "@microsoft/signalr";
import { Player } from "@/types/Player";
import { Card } from "@/types/Card";
import { ButtonOne, ButtonTwo, ButtonThree } from "@/types/GameButtons";
import CardPotZone from "./CardPotZone";
import GameControls from "./GameControls";
import PlayerZone from "./PlayerZone";
import "./styles/Game.css";

interface Props {
    playerUsername: string;
}

const Game = ({playerUsername}: Props) => {
    const [players, setPlayers] = useState<Array<Player>>([{name: "JPokerStar", chips: 25000, isActive: false}, {name: "Ronnie", chips: 25000, isActive: false}, {name: "Fanny", chips: 25000, isActive: false}]);
    const [communityCards, setCommunityCards] = useState<Card[]>([]);
    const [potTotal, setPotTotal] = useState<number>(1296400);

    const [button1Value, setButton1Value] = useState<ButtonOne>("Check/Fold");
    const [button2Value, setButton2Value] = useState<ButtonTwo>("Check");
    const [button3Value, setButton3Value] = useState<ButtonThree>("Call Any");
    const [isButton1Active, setIsButton1Active] = useState<boolean>(false);
    const [isButton2Active, setIsButton2Active] = useState<boolean>(false);
    const [isButton3Active, setIsButton3Active] = useState<boolean>(false);

    const [connection, setConnection] = useState<signalr.HubConnection>();

    useEffect(() => {
        const conn = new signalr.HubConnectionBuilder().withUrl("https://localhost:44392/gameHub").build();

        conn.on("ReceiveMessage", (username: string, message: string) => {
            console.log(username + ": " + message);
        });
        
        conn.start().catch((e) => console.error(e));
        setConnection(conn);
    }, []);

    useEffect(() => {
        if (connection) {
            JoinLobby("JPokerStar", "3174");
        }
    }, [connection]);

    const JoinLobby = (username: string, lobbyId: string) => {
        if (connection) {
            connection.invoke("JoinLobby", { username: username, lobbyId: lobbyId });
        }
    };

    const button1 = () => {
        console.log("button 1 pressed");
        if (isButton1Active) {
            setIsButton1Active(false);
        } else {
            setIsButton1Active(true);
            setIsButton2Active(false);
            setIsButton3Active(false);
        }
    };

    const button2 = () => {
        console.log("button 2 pressed");
        if (isButton2Active) {
            setIsButton2Active(false);
        } else {
            setIsButton1Active(false);
            setIsButton2Active(true);
            setIsButton3Active(false);
        }
    };

    const button3 = () => {
        console.log("button 3 pressed");
        if (isButton3Active) {
            setIsButton3Active(false);
        } else {
            setIsButton1Active(false);
            setIsButton2Active(false);
            setIsButton3Active(true);
        }
    };

    useEffect(() => {
    }, []);

    return (
        <div className="game-container">
            <div className="gameWindow-container">
                <div className="game-table"></div>
                <div className="game-rowOfPlayers">
                    <PlayerZone 
                        player={players[3] !== undefined ? players[3] : undefined}
                        clientUsername={playerUsername}
                    />
                    <PlayerZone 
                        player={players[4] !== undefined ? players[4] : undefined}
                        clientUsername={playerUsername}
                    />
                    <PlayerZone 
                        player={players[5] !== undefined ? players[5] : undefined}
                        clientUsername={playerUsername}
                    />
                </div>
                <div className="game-rowOfPlayers" style={{justifyContent: "space-between"}}>
                    <PlayerZone 
                        player={players[2] !== undefined ? players[2] : undefined}
                        clientUsername={playerUsername}
                    />
                    <CardPotZone potTotal={potTotal} communityCards={communityCards}/>
                    <PlayerZone 
                        player={players[6] !== undefined ? players[6] : undefined}
                        clientUsername={playerUsername}
                    />
                </div>
                <div className="game-rowOfPlayers">
                    <PlayerZone 
                        player={players[1] !== undefined ? players[1] : undefined}
                        clientUsername={playerUsername}
                    />
                    <PlayerZone 
                        player={players[0] !== undefined ? players[0] : undefined}
                        clientUsername={playerUsername}
                    />
                    <PlayerZone 
                        player={players[7] !== undefined ? players[7] : undefined}
                        clientUsername={playerUsername}
                    />
                </div>
            </div>
            <GameControls 
                button1={button1} 
                button2={button2} 
                button3={button3} 
                button1Value={button1Value} 
                button2Value={button2Value} 
                button3Value={button3Value} 
                isButton1Active={isButton1Active} 
                isButton2Active={isButton2Active} 
                isButton3Active={isButton3Active} 
            />
        </div>
    );
};

export default Game;