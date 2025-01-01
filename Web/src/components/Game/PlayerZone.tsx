import { memo } from "react";
import CardComponent from "./CardComponent";
import { abbreviateChips } from "@/helpers/GameUtil";
import "./styles/PlayerZone.css";
import ChipGraphics from "./ChipGraphics";
import { Player } from "@/types/Player";

interface Props {
    player?: Player;
    clientUsername: string;
}

const PlayerZone = memo(function PlayerZone({ player, clientUsername }: Props) {
    
    if (!player) {
        return (
            <div className="player-container" style={{backgroundColor: "transparent"}}/>
        );
    }

    const Cards = () => {
        return (
            <div className="playerCards-container">
                <CardComponent card={player?.card1}/>
                <CardComponent card={player?.card2}/>
            </div>
        );
    }

    const Chips = () => {
        return (
            <div className="playerChips-container">
                <div className="playerChips-image"></div>
                <ChipGraphics chips={player?.chips} />
                <span className="playerChips-count">{abbreviateChips(player?.chips)}</span>
            </div>
        );
    }

    return (
        <div className="player-container">
            <span style={clientUsername === player.name ? {color: "green"} : {}}>{player.name}</span>
            <Cards/>
            <Chips/>
        </div>
    );
});

export default PlayerZone;