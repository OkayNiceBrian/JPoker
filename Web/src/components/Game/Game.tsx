import { useEffect, useState } from "react";
import * as signalr from "@microsoft/signalr";
import { Player } from "@/types/Player";
import { Card } from "@/types/Card";
import { ButtonOne, ButtonTwo, ButtonThree, GameAction } from "@/types/GameActions";
import CardPotZone from "./CardPotZone";
import GameControls from "./GameControls";
import PlayerZone from "./PlayerZone";
import "./styles/Game.css";

interface Props {
    playerUsername: string; // Should probably be in redux when I get that in the project
}

const Game = ({/*playerUsername*/}: Props) => {
    const [playerUsername, setPlayerUsername] = useState<string>("");
    const [lobbyId, setLobbyId] = useState<string>("");
    const [inLobby, setInLobby] = useState<boolean>(true);

    const [players, setPlayers] = useState<Array<Player>>([]);
    const [communityCards, setCommunityCards] = useState<Card[]>([]);
    const [potTotal, setPotTotal] = useState<number>(0);

    const [turnIndex, setTurnIndex] = useState<number>(0);

    const [button1Value, setButton1Value] = useState<ButtonOne>("Check/Fold");
    const [button2Value, setButton2Value] = useState<ButtonTwo>("Check");
    const [button3Value, setButton3Value] = useState<ButtonThree>("Call Any");
    const [isButton1Active, setIsButton1Active] = useState<boolean>(false);
    const [isButton2Active, setIsButton2Active] = useState<boolean>(false);
    const [isButton3Active, setIsButton3Active] = useState<boolean>(false);

    const [connection, setConnection] = useState<signalr.HubConnection>();

    const userConnection = { Username: playerUsername, LobbyId: lobbyId }; // property names must be the EXACT same on client and server, including case.

    useEffect(() => {
        const conn = new signalr.HubConnectionBuilder().withUrl("https://localhost:44392/gameHub").build();

        conn.on("ReceiveMessage", (username: string, message: string) => {
            console.log(username + ": " + message);
        });

        conn.on("ReceivePlayers", (players: Player[]) => {
            setPlayers(players);
            console.log(players);
        });

        conn.on("Action", (player: Player, action: GameAction, turnIndex: number) => {
            setPlayers(prev => prev.map((p) => p.username === player.username ? player : p));

            if (action === "bet") {
                // do something
            }

            setTurnIndex(turnIndex);
        });

        conn.start().catch((e) => console.error(e));
        setConnection(conn);
    }, []);

    useEffect(() => {
        if (isButton1Active && players[turnIndex].username === playerUsername) {
            if (connection) {
                connection?.invoke("GameAction", userConnection, "check");
                setIsButton1Active(false);
            }
        }
    }, [turnIndex, connection, players, playerUsername, isButton1Active]);

    const JoinLobby = () => {
        if (connection) {
            connection.invoke("JoinLobby", userConnection);
        }
    };

    const button1 = () => {
        if (isButton1Active) {
            setIsButton1Active(false);
        } else {
            setIsButton1Active(true);
            setIsButton2Active(false);
            setIsButton3Active(false);
        }
    };

    const button2 = () => {
        if (isButton2Active) {
            setIsButton2Active(false);
        } else {
            setIsButton1Active(false);
            setIsButton2Active(true);
            setIsButton3Active(false);
        }
    };

    const button3 = () => {
        if (isButton3Active) {
            setIsButton3Active(false);
        } else {
            setIsButton1Active(false);
            setIsButton2Active(false);
            setIsButton3Active(true);
        }
    };

    const clickJoinLobby = () => {
        JoinLobby();
        setInLobby(false);
    }

    if (inLobby) {
        return (
            <div className="game-container">
                <label>Lobby Id</label>
                <input value={lobbyId} onChange={(e) => setLobbyId(e.target.value)}></input>
                <label>Username</label>
                <input value={playerUsername} onChange={(e) => setPlayerUsername(e.target.value)}></input>
                <button onClick={clickJoinLobby} disabled={lobbyId === "" || playerUsername === ""}>Join Lobby</button>
            </div>
        );
    }
console.log(players);
    return (
        <div className="game-container">
            <div className="gameWindow-container">
                <div className="game-table"></div>
                <div className="game-rowOfPlayers">
                    <PlayerZone 
                        player={players[3] !== undefined ? players[3] : undefined}
                        clientUsername={players[3]?.username}
                        isTurn={turnIndex === 3}
                    />
                    <PlayerZone 
                        player={players[4] !== undefined ? players[4] : undefined}
                        clientUsername={players[4]?.username}
                        isTurn={turnIndex === 4}
                    />
                    <PlayerZone 
                        player={players[5] !== undefined ? players[5] : undefined}
                        clientUsername={players[5]?.username}
                        isTurn={turnIndex === 5}
                    />
                </div>
                <div className="game-rowOfPlayers" style={{justifyContent: "space-between"}}>
                    <PlayerZone 
                        player={players[2] !== undefined ? players[2] : undefined}
                        clientUsername={players[2]?.username}
                        isTurn={turnIndex === 2}
                    />
                    <CardPotZone potTotal={potTotal} communityCards={communityCards}/>
                    <PlayerZone 
                        player={players[6] !== undefined ? players[6] : undefined}
                        clientUsername={players[6]?.username}
                        isTurn={turnIndex === 6}
                    />
                </div>
                <div className="game-rowOfPlayers">
                    <PlayerZone 
                        player={players[1] !== undefined ? players[1] : undefined}
                        clientUsername={players[1]?.username}
                        isTurn={turnIndex === 1}
                    />
                    <PlayerZone 
                        player={players[0] !== undefined ? players[0] : undefined}
                        clientUsername={players[0] !== undefined ? players[0].username : ""}
                        isTurn={turnIndex === 0}
                    />
                    <PlayerZone 
                        player={players[7] !== undefined ? players[7] : undefined}
                        clientUsername={players[7]?.username}
                        isTurn={turnIndex === 7}
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