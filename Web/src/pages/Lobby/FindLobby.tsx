import bgImg from "@/assets/cowboy-poker.jpg";
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
            return (
                <div className="findLobby-gridCellContainer" key={lobby.lobbyId} onClick={() => navigate(`/lobby/${lobby.lobbyId}`)}>
                    <p>{lobby.lobbyId}</p>
                    <p>{lobby.playerCount}/8</p>
                </div>
            )
        })
    }

    return (
        <div className="lobby-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="lobby-formContainer">
                <input type="button" value={"<- Back to Home"} onClick={() => navigate("/")} />
                <div className="findLobby-gridContainer">
                    {RenderLobbies(lobbies)}
                </div>
            </div>
        </div>
    );
}

export default FindLobby;