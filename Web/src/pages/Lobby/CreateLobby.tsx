import bgImg from "@/assets/background.jpg";
import useConnection from "@/hooks/useConnection";
import { addUserConnection } from "@/reducers/chatSlice";
import { selectUsername } from "@/reducers/userSlice";
import { UserConnection } from "@/types/NetworkTypes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./Lobby.css";

const CreateLobby = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const username = useSelector(selectUsername);
    const connection = useConnection();

    const [lobbyName, setLobbyName] = useState<string>("");
    const [hasTurnTimer, setHasTurnTimer] = useState<boolean>(false);
    const [turnTimer, setTurnTimer] = useState<number>(30);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");

    const submitButton = () => {
        if (lobbyName.trim() != "") {
            return (
                <input type="button" value={"Create Lobby"} onClick={onClickSubmit} />
            )
        }

        return null;
    };

    const onClickSubmit = async () => {
        const userConnection: UserConnection = { LobbyId: lobbyName.trim(), Username: username! }
        await dispatch(addUserConnection(userConnection));
        navigate(`/lobby/${userConnection.LobbyId}`);
    }

    return (
        <div className="lobby-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="lobby-formContainer">
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