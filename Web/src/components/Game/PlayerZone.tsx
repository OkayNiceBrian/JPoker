import { memo } from "react";
import CardComponent from "./CardComponent";
import { abbreviateChips } from "@/helpers/GameUtil";
import "./styles/PlayerZone.css";
import ChipGraphics from "./ChipGraphics";
import { Player } from "@/types/Player";

interface Props {
    player?: Player;
    clientUsername: string;
    isTurn: boolean;
    isDealer: boolean;
    isSmallBlind: boolean;
    isBigBlind: boolean;
}

const PlayerZone = memo(function PlayerZone(props: Props) {

    const {
        player,
        clientUsername,
        isTurn,
        isDealer,
        isSmallBlind,
        isBigBlind
    } = props;
    
    if (!player) {
        return (
            <div className="player-container" style={{backgroundColor: "transparent"}}/>
        );
    }

    const Cards = () => {
        return player.isActive ? (
            <div className="playerCards-container">
                <CardComponent card={player?.card1}/>
                <CardComponent card={player?.card2}/>
            </div>
        ) : null;
    };

    const Chips = () => {
        return (
            <div className="playerChips-container">
                <div className="playerChips-image"></div>
                <ChipGraphics chips={player?.chips} />
                <span className="player-text">{abbreviateChips(player?.chips)}</span>
            </div>
        );
    };

    const PositionChip = () => {
        return isDealer ? (
            <div className="positionChip-container">
                D
            </div>
        ) : isSmallBlind ? (
            <div className="positionChip-container" style={{ backgroundColor: "blue" }}>
                SB
            </div>
        ) : isBigBlind ? (
            <div className="positionChip-container" style={{ backgroundColor: "red" }}>
                BB
            </div>
        ) : null;
    };

    return (
        <div className="player-container" style={isTurn ? {backgroundColor: "rgba(255, 255, 255, .4)"} : {}}>
            <span className="player-text" style={clientUsername === player.username ? {fontWeight: "bold", color: "turquoise"} : {}}>{player.username}{player.username == clientUsername && " (ME)"}</span>
            <Cards/>
            <Chips/>
            <PositionChip />
        </div>
    );
});

export default PlayerZone;