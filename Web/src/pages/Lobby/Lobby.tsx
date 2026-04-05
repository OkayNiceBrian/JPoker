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
        return <div>
            {players.map((player, index) => {
                return <p key={index}>{player.username}</p>
            })}
        </div>  
    };

    const onClickBackButton = () => {
        connection?.invoke("LeaveLobby", userConnection).catch(e => console.error(e));
        setUserConnection(null);
        navigate("/findLobby");
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
                <input type="button" value={"<- Back to Find Lobbies"} onClick={() => onClickBackButton()} />
                <h1>{lobbyId}</h1>
                {RenderPlayerCell(players)}
                
                { players.length > 1 && (
                    <input type="button" value={"Start Game"} onClick={() => onClickStartGame()} />
                )}
            </div>
        </div>
    );
}

export default Lobby;