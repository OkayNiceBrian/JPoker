import { useState } from "react";
import "./Home.css";
import bgImg from "@/assets/background.jpg";
import { setUsername, selectUsername } from "@/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
    const dispatch = useDispatch();
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
    }

    const CreateOrFindLobby = () => {
        return (
            <div className="enterUsername-container">
                <input type="button" value={"Create Lobby"} />
                <input type="button" value={"Find Lobby"} />
            </div>
        );
    };

    return (
        <>
            <div className="home-container">
                <img src={bgImg} className="home-backgroundImage" />
                <div className="jpoker-logo-background">
                    <p className="jpoker-logo-typography">JPoker</p>
                    <p className="">The World's #1 (shitty) Poker Website!</p>
                </div>
                { username == null ? <EnterUsername /> : 
                <>
                    <CreateOrFindLobby />
                    <input type="button" value={"Reset Username"} onClick={() => dispatch(setUsername(null))}/>
                </>}
            </div>
        </>
    );
};

export default Home;