import bgImg from "@/assets/renaissance-poker.jpg";
import useConnection from "@/hooks/useConnection";
import { selectUserConnection, setUserConnection } from "@/reducers/chatSlice";
import { selectUsername } from "@/reducers/userSlice";
import { Lobby as LobbyType } from "@/types/Lobby";
import { UserConnection } from "@/types/NetworkTypes";
import { Player } from "@/types/Player";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

const Lobby = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { lobbyId } = useParams();
    const userConnection = useSelector(selectUserConnection);
    const playerUsername = useSelector(selectUsername);

    const connection = useConnection();

    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const userConnection: UserConnection = {
            LobbyId: lobbyId!,
            Username: playerUsername!
        }
        dispatch(setUserConnection(userConnection));
    }, [])

    useEffect(() => {
        if (connection && userConnection) {
            console.log(connection);
            console.log(userConnection)
            connection.invoke("JoinLobby", userConnection).catch(e => console.error(e));
        }
    }, [connection, userConnection]);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveLobbyInfo", (lobby: LobbyType) => {
                setPlayers(lobby.players);
            });

            connection.on("EnterGameRoom", () => {
                navigate("play");
            });
        }
    });

    const RenderPlayerCell = (players: Player[]) => {
        return (
            <div className="lobby-playersContainer">
                <p>{`${players.length}/8`} Players</p>
                {players.map((player, index) => {
                    return <p key={index} style={{ fontSize: "20pt", color: playerUsername == player.username ? "rgb(50, 150, 255)" : "auto" }}>{player.username}</p>
                })}
                
            </div>  
        );
    };

    const onClickBackButton = () => {
        connection?.invoke("LeaveLobby", userConnection).catch(e => console.error(e));
        setUserConnection(null);
        navigate("/");
    }

    const onClickStartGame = () => {
        if (connection && userConnection) {
            connection?.invoke("StartGame", userConnection);
        }
    }

    return (
        <div className="lobby-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="lobby-formContainer">
                <input type="button" className="button" value={"Back"} onClick={() => onClickBackButton()} />
                <div className="lobby-nameContainer">
                    <p>Lobby Name</p>
                    <p className="lobby-lobbyName">{lobbyId}</p>
                </div>
                {RenderPlayerCell(players)}
                { players.length > 1 && (
                    <input type="button" className="button" style={{alignSelf: "center", marginTop: "2rem"}} value={"Start Game"} onClick={() => onClickStartGame()} />
                )}
            </div>
        </div>
    );
}

export default Lobby;