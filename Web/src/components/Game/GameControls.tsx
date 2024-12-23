import { useState } from "react";

type ButtonOne = "Check/Fold" | "Fold";
type ButtonTwo = "Check" | "Call";
type ButtonThree = "Call Any" | "Raise" | "All In";

const GameControls = () => {
    const [buttonOneValue, setButtonOneValue] = useState<ButtonOne>("Check/Fold");
    const [buttonTwoValue, setButtonTwoValue] = useState<ButtonTwo>("Check");
    const [buttonThreeValue, setButtonThreeValue] = useState<ButtonThree>("Call Any");

    return (
        <div className="gameControls-container">
            <button>{buttonOneValue}</button>
            <button>{buttonTwoValue}</button>
            <button>{buttonThreeValue}</button>
        </div>
    );
};

export default GameControls;