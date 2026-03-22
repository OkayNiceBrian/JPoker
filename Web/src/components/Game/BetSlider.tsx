import { memo, useState } from "react";
import "./styles/BetSlider.css";

interface Props {
    active: boolean;
    setActive: (value: boolean) => void;
    minBet: number;
    activeBet: number;
    playerChips: number;
    pendingBet: number;
    setPendingBet: (value: number) => void;
}

const BetSlider = (props: Props) => {
    const {
        active,
        setActive,
        minBet,
        activeBet,
        playerChips,
        pendingBet,
        setPendingBet
    } = props;

    console.log(playerChips)

    const [sliderValue, setSliderValue] = useState<number>(Math.max(minBet, pendingBet));

    const onChangeSlider = (value: string) => {
        setSliderValue(parseInt(value));
    };

    const onClickSendBet = () => {
        setPendingBet(sliderValue);
        setSliderValue(minBet);
        setActive(false);
    }

    return (
        <div className="bet-container" style={{display: !active ? "none" : "initial"}}>
            <div className="betSlider-container">
                <p>Bet</p>
                <input
                    type="number"
                    value={sliderValue}
                    min={500} 
                    step={250} 
                    max={playerChips}
                    onChange={(e) => onChangeSlider(e.target.value)}
                />
                <input 
                    className="betSlider-slider" 
                    type="range" 
                    value={sliderValue} 
                    min={500} 
                    step={250} 
                    max={playerChips}
                    onChange={(e) => onChangeSlider(e.target.value)}
                />
                <input 
                    type="button"
                    value="Send Bet"
                    onClick={onClickSendBet}
                />
            </div>
        </div>
    );
};

export default BetSlider;