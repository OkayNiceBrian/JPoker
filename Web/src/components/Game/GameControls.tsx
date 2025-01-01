import { memo } from "react";
import { ButtonOne, ButtonThree, ButtonTwo } from "@/types/GameActions";
import "./styles/GameControls.css"

interface Props {
    button1: Function;
    button1Value: ButtonOne;
    isButton1Active: boolean;
    button2: Function;
    button2Value: ButtonTwo;
    isButton2Active: boolean;
    button3: Function;
    button3Value: ButtonThree;
    isButton3Active: boolean;
}

const GameControls = memo(function GameControls(props: Props) {
    return (
        <div className="gameControls-container">
            <button className={`gameControls-button ${props.isButton1Active && "gameControls-button-active"}`} onClick={() => props.button1()}><span>{props.button1Value}</span></button>
            <button className={`gameControls-button ${props.isButton2Active && "gameControls-button-active"}`} onClick={() => props.button2()}><span>{props.button2Value}</span></button>
            <button className={`gameControls-button ${props.isButton3Active && "gameControls-button-active"}`} onClick={() => props.button3()}><span>{props.button3Value}</span></button>
        </div>
    );
});

export default GameControls;