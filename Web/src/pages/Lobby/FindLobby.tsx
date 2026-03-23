import bgImg from "@/assets/background.jpg";
import useConnection from "@/hooks/useConnection";
import { LobbySearchViewModel } from "@/types/LobbySearchViewModel";
import { useEffect, useState } from "react";

const FindLobby = () => {
    const connection = useConnection();

    const [lobbies, setLobbies] = useState<LobbySearchViewModel[]>([]);

    useEffect(() => {
        if (connection) {
            connection.invoke("GetLobbies");
        }
    }, [connection]);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveLobbies", (lobbies: LobbySearchViewModel[]) => {
                setLobbies(lobbies);
            });
        }
    }, [connection])

    return (
        <div className="lobby-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="lobby-formContainer">
                {lobbies.map((lobby) => {
                    return <p>{lobby.playerCount}/8 - {lobby.lobbyId}</p>
                })}
            </div>
        </div>
    );
}

export default FindLobby;