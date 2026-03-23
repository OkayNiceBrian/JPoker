import bgImg from "@/assets/background.jpg";
import useConnection from "@/hooks/useConnection";
import { selectUserConnection } from "@/reducers/chatSlice";
import { selectUsername } from "@/reducers/userSlice";
import { Lobby as LobbyType } from "@/types/Lobby";
import { Player } from "@/types/Player";
import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

const Lobby = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { lobbyId } = useParams();
    const userConnection = useSelector(selectUserConnection);
    const playerUsername = useSelector(selectUsername);
    
    if (playerUsername == null || playerUsername != userConnection?.Username || lobbyId != userConnection?.LobbyId) {
        navigate("/");
    }

    const connection = useConnection();

    const [players, setPlayers] = useState<Player[]>([]);

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
        }
    });

    const RenderPlayerCell = (players: Player[]) => {
        return <div>
            {players.map((player, index) => {
                return <p key={index}>{player.username}</p>
            })}
        </div>
        
    };

    return (
        <div className="lobby-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="lobby-formContainer">
                <input type="button" value={"<- Back to Home"} onClick={() => navigate("/")} />
                <h1>{lobbyId}</h1>
                {RenderPlayerCell(players)}
                
                { players.length > 1 && (
                    <input type="button" value={"Start Game"} />
                )}
            </div>
        </div>
    );
}

export default Lobby;