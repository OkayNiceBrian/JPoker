import { useEffect, useState } from "react";
import * as signalr from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, addUserConnection, selectUserConnection } from "@/reducers/chatSlice";
import { Player } from "@/types/Player";
import { Card } from "@/types/Card";
import { Lobby } from "@/types/Lobby";
import { ButtonOne, ButtonTwo, ButtonThree, GameAction } from "@/types/GameActions";
import CardPotZone from "./CardPotZone";
import GameControls from "./GameControls";
import PlayerZone from "./PlayerZone";
import "./styles/Game.css";
import { UserConnection } from "@/types/NetworkTypes";
import BetSlider from "./BetSlider";

interface Props {
    //playerUsername: string; // Should probably be in redux when I get that in the project
}

const Game = () => {
    const dispatch = useDispatch();

    const [playerUsername, setPlayerUsername] = useState<string>("");
    const [lobbyId, setLobbyId] = useState<string>("");
    const [inLobby, setInLobby] = useState<boolean>(true);

    const [players, setPlayers] = useState<Array<Player>>([]);
    const [communityCards, setCommunityCards] = useState<Card[]>([]);
    const [potTotal, setPotTotal] = useState<number>(0);
    
    const [smallBlind, setSmallBlind] = useState<number>(500);
    const [bigBlind, setBigBlind] = useState<number>(1000);
    const [minBet, setMinBet] = useState<number>(100);

    const [turnIndex, setTurnIndex] = useState<number>(0);
    const [dealerIndex, setDealerIndex] = useState<number>(0);
    const [smallBlindIndex, setSmallBlindIndex] = useState<number>(0);
    const [bigBlindIndex, setBigBlindIndex] = useState<number>(0);
    const [turnTimerSeconds, setTurnTimerSeconds] = useState<number>(30);
    const [playerChips, setPlayerChips] = useState<number>(0);

    const [activeBet, setActiveBet] = useState<number>(0);
    const [playerBet, setPlayerBet] = useState<number>(0);
    const [pendingBet, setPendingBet] = useState<number>(0);

    const [isWinner, setIsWinner] = useState<boolean>(false);

    const [button1Value, setButton1Value] = useState<ButtonOne>("Check/Fold");
    const [button2Value, setButton2Value] = useState<ButtonTwo>("Check");
    const [button3Value, setButton3Value] = useState<ButtonThree>("Bet");
    const [isButton1Active, setIsButton1Active] = useState<boolean>(false);
    const [isButton2Active, setIsButton2Active] = useState<boolean>(false);
    const [isButton3Active, setIsButton3Active] = useState<boolean>(false);
    const [isBetSliderActive, setIsBetSliderActive] = useState<boolean>(false);

    const [connection, setConnection] = useState<signalr.HubConnection>();

    const userConnection = useSelector(selectUserConnection);

    useEffect(() => {
        const conn = new signalr.HubConnectionBuilder().withUrl("https://localhost:44392/gameHub").build();

        conn.on("ReceiveMessage", (username: string, message: string) => {
            console.log(username + ": " + message);
            dispatch(addMessage(`${username}: ${message}`));
        });

        conn.on("ReceiveLobbyInfo", (lobby: Lobby) => {
            setLobby(lobby);
            setIsWinner(false);
        });

        conn.on("ReceiveWinner", (lobby: Lobby) => {
            setLobby(lobby);
            setIsWinner(true);
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
    }, [playerUsername]);

    const setLobby = (lobby: Lobby) => {
        setPlayers(lobby.players);
        setActiveBet(lobby.activeBet);
        setSmallBlind(lobby.smallBlind);
        setBigBlind(lobby.bigBlind);
        setTurnIndex(lobby.turnIndex);
        setDealerIndex(lobby.dealerIndex);
        setSmallBlindIndex(lobby.smallBlindIndex);
        setBigBlindIndex(lobby.bigBlindIndex);
        setTurnTimerSeconds(lobby.turnTimerSeconds);
        setCommunityCards(lobby.communityCards);
        setPotTotal(lobby.pot);
        setPlayerChips(lobby.players.find(p => p.username === playerUsername)!.chips);
    }

    useEffect(() => { // On the start of a new turn or when the bet changes...
        if (activeBet == 0) {
            setButton1Value("Check/Fold");
            setButton2Value("Check");
            setButton3Value("Bet");
        } else if (activeBet > 0) {
            setButton1Value("Fold");
            setButton2Value("Call");
            setButton3Value("Raise");

            if (activeBet >= players.find(p => p.username == playerUsername)!.chips) {
                setButton3Value("All In");
            }
        }
    }, [turnIndex, activeBet, players]);

    useEffect(() => {
        if (players.length > 0 && connection && players[turnIndex].username === playerUsername) {
            if (isButton1Active) {
                if (button1Value == "Check/Fold") {
                    connection?.invoke("GameAction", userConnection, "check");
                    setIsButton1Active(false);
                }
                if (button1Value == "Fold") {
                    connection?.invoke("GameAction", userConnection, "fold");
                    setIsButton1Active(false);
                }
            } else if (isButton2Active) {
                if (button2Value == "Check") {
                    connection?.invoke("GameAction", userConnection, "check");
                    setIsButton2Active(false);
                }
                if (button2Value == "Call") {
                    connection?.invoke("GameAction", userConnection, "call");
                    setIsButton2Active(false);
                }
            } else if (isButton3Active) {
                if (button3Value == "Bet") {
                    connection?.invoke("GameAction", userConnection, `bet ${pendingBet}`);
                    setPendingBet(0);
                    setIsButton3Active(false);
                }
                if (button3Value == "Raise") {
                    connection?.invoke("GameAction", userConnection, `raise ${pendingBet}`);
                    setPendingBet(0);
                    setIsButton3Active(false);
                }
                if (button3Value == "All In") {
                    connection?.invoke("GameAction", userConnection, "all in");
                    setIsButton3Active(false);
                }
            }
        }
    }, [turnIndex, connection, players, playerUsername, isButton1Active, isButton2Active, isButton3Active]);

    useEffect(() => {
        // console.log(playerChips);
    }, [playerChips])

    const JoinLobby = (userConnection: UserConnection) => {
        if (connection && userConnection) {
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
        setIsButton1Active(false);
        setIsButton2Active(false);
        button3Value == "All In" ? setIsButton3Active(true) : setIsButton3Active(false);

        if (button3Value == "Bet" || button3Value == "Raise") {
            setIsBetSliderActive(prev => !prev.valueOf());
        }

        if (isButton3Active) {
            setPendingBet(0);
        }
        
    };

    useEffect(() => { // If PendingBet changes
        setIsButton3Active(pendingBet > 0);
    }, [pendingBet]);

    const clickJoinLobby = () => {
        const userConnection: UserConnection = { LobbyId: lobbyId, Username: playerUsername }
        dispatch(addUserConnection(userConnection));

        JoinLobby(userConnection);
        setInLobby(false);
    };

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

    return (
        <div className="game-container">
            <div className="gameWindow-container">
                <div className="game-table"></div>
                <div className="game-rowOfPlayers">
                    <PlayerZone 
                        player={players[3] !== undefined ? players[3] : undefined}
                        clientUsername={playerUsername}
                        isTurn={turnIndex === 3}
                        isDealer={dealerIndex === 3}
                        isSmallBlind={smallBlindIndex === 3}
                        isBigBlind={bigBlindIndex === 3}
                        isWinner={isWinner}
                    />
                    <PlayerZone 
                        player={players[4] !== undefined ? players[4] : undefined}
                        clientUsername={playerUsername}
                        isTurn={turnIndex === 4}
                        isDealer={dealerIndex === 4}
                        isSmallBlind={smallBlindIndex === 4}
                        isBigBlind={bigBlindIndex === 4}
                        isWinner={isWinner}
                    />
                    <PlayerZone 
                        player={players[5] !== undefined ? players[5] : undefined}
                        clientUsername={playerUsername}
                        isTurn={turnIndex === 5}
                        isDealer={dealerIndex === 5}
                        isSmallBlind={smallBlindIndex === 5}
                        isBigBlind={bigBlindIndex === 5}
                        isWinner={isWinner}
                    />
                </div>
                <div className="game-rowOfPlayers" style={{justifyContent: "space-between"}}>
                    <PlayerZone 
                        player={players[2] !== undefined ? players[2] : undefined}
                        clientUsername={playerUsername}
                        isTurn={turnIndex === 2}
                        isDealer={dealerIndex === 2}
                        isSmallBlind={smallBlindIndex === 2}
                        isBigBlind={bigBlindIndex === 2}
                        isWinner={isWinner}
                    />
                    <CardPotZone potTotal={potTotal} communityCards={communityCards}/>
                    <PlayerZone 
                        player={players[6] !== undefined ? players[6] : undefined}
                        clientUsername={playerUsername}
                        isTurn={turnIndex === 6}
                        isDealer={dealerIndex === 6}
                        isSmallBlind={smallBlindIndex === 6}
                        isBigBlind={bigBlindIndex === 6}
                        isWinner={isWinner}
                    />
                </div>
                <div className="game-rowOfPlayers">
                    <PlayerZone 
                        player={players[1] !== undefined ? players[1] : undefined}
                        clientUsername={playerUsername}
                        isTurn={turnIndex === 1}
                        isDealer={dealerIndex === 1}
                        isSmallBlind={smallBlindIndex === 1}
                        isBigBlind={bigBlindIndex === 1}
                        isWinner={isWinner}
                    />
                    <PlayerZone 
                        player={players[0] !== undefined ? players[0] : undefined}
                        clientUsername={playerUsername}
                        isTurn={turnIndex === 0}
                        isDealer={dealerIndex === 0}
                        isSmallBlind={smallBlindIndex === 0}
                        isBigBlind={bigBlindIndex === 0}
                        isWinner={isWinner}
                    />
                    <PlayerZone 
                        player={players[7] !== undefined ? players[7] : undefined}
                        clientUsername={playerUsername}
                        isTurn={turnIndex === 7}
                        isDealer={dealerIndex === 7}
                        isSmallBlind={smallBlindIndex === 7}
                        isBigBlind={bigBlindIndex === 7}
                        isWinner={isWinner}
                    />
                </div>
            </div>
            <BetSlider 
                active={isBetSliderActive}
                setActive={setIsBetSliderActive}
                activeBet={activeBet}
                playerChips={playerChips}
                minBet={minBet}
                pendingBet={pendingBet}
                setPendingBet={setPendingBet}
            />
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
                activeBet={activeBet}
                playerChips={playerChips}
                playerBet={playerBet}
                pendingBet={pendingBet}
            />
        </div>
    );
};

export default Game;