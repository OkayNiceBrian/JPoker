import bgImg from "@/assets/background.jpg";
import "./Lobby.css";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserConnection } from "@/reducers/chatSlice";
import { UserConnection } from "@/types/NetworkTypes";
import { selectUsername } from "@/reducers/userSlice";
import { Connection } from "@/network/Connection";

const CreateLobby = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const username = useSelector(selectUsername);
    const connection = Connection.getConnection();

    const [lobbyName, setLobbyName] = useState<string>("");
    const [hasTurnTimer, setHasTurnTimer] = useState<boolean>(false);
    const [turnTimer, setTurnTimer] = useState<number>(30);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");

    const submitButton = () => {
        if (lobbyName.trim() != "") {
            return (
                <input value={"Create Lobby"} onClick={onClickSubmit} />
            )
        }

        return null;
    };

    const onClickSubmit = () => {
        const userConnection: UserConnection = { LobbyId: lobbyName.trim(), Username: username! }
        dispatch(addUserConnection(userConnection));
        connection.getHubConnection().invoke("JoinLobby", userConnection);
        navigate(`lobby/${userConnection.LobbyId}`);
    }

    return (
        <div className="lobby-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="createLobby-formContainer">
                <input type="button" value={"<- Back to Home"} onClick={() => navigate("/")} />
                <div className="lobby-inputContainer">
                    <label>Lobby Name</label>
                    <input value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} />
                </div><div className="lobby-inputContainer">
                    <label>Turn Timer?</label>
                    <input type="checkbox" checked={hasTurnTimer} onClick={() => setHasTurnTimer(prev => !prev)}/>
                    { hasTurnTimer && <input type="number" value={turnTimer} onChange={(e) => setTurnTimer(parseInt(e.target.value))} /> }
                </div>
                <div className="lobby-inputContainer">
                    <label>Is Private?</label>
                    <input type="checkbox" checked={isPrivate} onClick={() => setIsPrivate(prev => !prev)} />
                </div>
                { isPrivate && (
                    <div className="lobby-inputContainer">
                        <label>Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                )}
                {submitButton()}
            </div>
        </div>
    );
}

export default CreateLobby;