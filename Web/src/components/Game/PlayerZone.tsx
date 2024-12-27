import { memo, useEffect } from "react";
import { Card } from "@/types/Card";
import CardComponent from "./CardComponent";
import { abbreviateChips } from "@/helpers/GameUtil";
import "./styles/PlayerZone.css";
import ChipGraphics from "./ChipGraphics";

interface Props {
    playerName: string;
    chips: number;
    card1?: Card;
    card2?: Card;
}

const PlayerZone = memo(function PlayerZone({ playerName, chips, card1, card2 }: Props) {

    const Cards = () => {
        return (
            <div className="playerCards-container">
                <CardComponent card={card1}/>
                <CardComponent card={card2}/>
            </div>
        );
    }

    const Chips = () => {
        return (
            <div className="playerChips-container">
                <div className="playerChips-image"></div>
                <ChipGraphics chips={chips} />
                <span className="playerChips-count">{abbreviateChips(chips)}</span>
            </div>
        );
    }

    return (
        <div className="player-container">
            <span>{playerName}</span>
            <Cards/>
            <Chips/>
        </div>
    );
});

export default PlayerZone;