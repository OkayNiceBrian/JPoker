import { memo, useState } from "react";
import "./Home.css";
import bgImg from "@/assets/cowboy-poker.jpg";
import { setUsername, selectUsername } from "@/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector(selectUsername);

    const [usernameInput, setUsernameInput] = useState<string>("");

    const EnterUsername = () => {
        return (
            <div className="enterUsername-container">
                <p>Enter Username</p>
                <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
                <input type="button" value={"Submit"} onClick={() => usernameInput.trim() != "" && dispatch(setUsername(usernameInput.trim()))}/>
            </div>
        );
    };

    const CreateOrFindLobby = () => {
        return (
            <div className="enterUsername-container">
                <input type="button" value={"Create Lobby"} onClick={() => navigate("createLobby")}/>
                <input type="button" value={"Find Lobby"} onClick={() => navigate("findLobby")}/>
            </div>
        );
    };

    return (
        <>
            <div className="home-container">
                <img src={bgImg} className="home-backgroundImage" />
                <div className="home-itemsContainer">
                    <div className="jpoker-logo-background">
                        <p className="jpoker-logo-typography">JPoker</p>
                        <p className="">The World's #1 (shitty) Poker Website</p>
                    </div>
                    { username == null ? EnterUsername() :  
                    <>
                        <CreateOrFindLobby />
                        <div className="enterUsername-container">
                            <p>You are {username}.</p>
                            <input type="button" value={"Reset Username"} onClick={() => dispatch(setUsername(null))}/>
                        </div>
                    </>}
                </div>
            </div>
        </>
    );
};

export default Home;