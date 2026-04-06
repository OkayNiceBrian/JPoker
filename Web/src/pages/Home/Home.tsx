import { memo, useState } from "react";
import "./Home.css";
import bgImg from "@/assets/cowboy-poker.jpg";
import { setUsername, selectUsername } from "@/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import FindLobby from "../Lobby/FindLobby";
import CreateLobby from "../Lobby/CreateLobby";
import { clean } from "profanity-cleaner";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector(selectUsername);

    const [usernameInput, setUsernameInput] = useState<string>("");

    const CreateOrFindLobby = () => {
        return (
            // <div className="enterUsername-container">
            //     <input type="button" value={"Create Lobby"} onClick={() => navigate("createLobby")}/>
            //     <input type="button" value={"Find Lobby"} onClick={() => navigate("findLobby")}/>
            // </div>
            <div className="homeItems-container">
                <FindLobby />
                <div className="home-verticalContainer">
                    <div className="home-titleItemContainer">
                        <p style={{ fontSize: "16pt" }}>Create Lobby</p>
                        <CreateLobby />
                    </div>
                    <div className="home-titleItemContainer">
                        <p style={{ fontSize: "16pt" }}>Reset Username</p>
                        <div className="enterUsername-container">
                            <p>You are {username}.</p>
                            <input type="button" className="button" value={"Reset Username"} onClick={() => dispatch(setUsername(null))}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return username == null ? (
        <div className="home-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="home-itemsContainer">
                <div className="home-headerContainer">
                    <div className="jpoker-logo-background">
                        <p className="jpoker-logo-typography">JPoker</p>
                        <p className="">The World's #1 (shitty) Poker Website</p>
                    </div>
                </div>
                <div className="homeItems-container">
                    <div className="enterUsername-container">
                        <p>Enter Username</p>
                        <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
                        <input type="button" className="button" value={"Submit"} onClick={() => usernameInput.trim() != "" && dispatch(setUsername(clean(usernameInput.trim())))}/>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="home-container">
            <img src={bgImg} className="home-backgroundImage" />
            <div className="home-itemsContainer">
                <div className="home-headerContainer">
                    <div className="jpoker-logo-background">
                        <p className="jpoker-logo-typography">JPoker</p>
                        <p className="">The World's #1 (shitty) Poker Website</p>
                    </div>
                </div>
                
                <CreateOrFindLobby />
            </div>
        </div>
    );
};

export default Home;