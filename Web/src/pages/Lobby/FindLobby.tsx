import bgImg from "@/assets/background.jpg";
import useConnection from "@/hooks/useConnection";
import { LobbySearchViewModel } from "@/types/LobbySearchViewModel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const FindLobby = () => {
    const connection = useConnection();
    const navigate = useNavigate();

    const [lobbies, setLobbies] = useState<LobbySearchViewModel[]>([]);

    useEffect(() => {
        if (connection) {
            connection.invoke("GetLobbies");
            console.log("Invoke GetLobbies");
        }
    }, [connection]);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveLobbies", (lobbies: LobbySearchViewModel[]) => {
                console.log(lobbies);
                setLobbies(lobbies);
            });
        }
    }, [connection])

    const RenderLobbies = (lobbies: LobbySearchViewModel[]) => {
        return lobbies.map((lobby: LobbySearchViewModel) => {
            return <p key={lobby.lobbyId} onClick={() => navigate(`/lobby/${lobby.lobbyId}`)}>{lobby.playerCount}/8 - {lobby.lobbyId}</p>
        })
    }

    return (
        <div className="lobby-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="lobby-formContainer">
                <input type="button" value={"<- Back to Home"} onClick={() => navigate("/")} />
                {RenderLobbies(lobbies)}
            </div>
        </div>
    );
}

export default FindLobby;