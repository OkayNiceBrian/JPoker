import { useState } from "react";
import "./styles/GameControls.css"

type ButtonOne = "Check/Fold" | "Fold";
type ButtonTwo = "Check" | "Call";
type ButtonThree = "Call Any" | "Raise" | "All In";

interface Props {
    button1: Function;
}

const GameControls = ({ button1 }: Props) => {
    const [buttonOneValue, setButtonOneValue] = useState<ButtonOne>("Check/Fold");
    const [buttonTwoValue, setButtonTwoValue] = useState<ButtonTwo>("Check");
    const [buttonThreeValue, setButtonThreeValue] = useState<ButtonThree>("Call Any");

    return (
        <div className="gameControls-container">
            <button className="gameControls-button" onClick={() => button1(true)}><span>{buttonOneValue}</span></button>
            <button className="gameControls-button"><span>{buttonTwoValue}</span></button>
            <button className="gameControls-button"><span>{buttonThreeValue}</span></button>
        </div>
    );
};

export default GameControls;