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
    isWinner: boolean;
}

const PlayerZone = memo(function PlayerZone(props: Props) {

    const {
        player,
        clientUsername,
        isTurn,
        isDealer,
        isSmallBlind,
        isBigBlind,
        isWinner
    } = props;
    
    if (!player) {
        return (
            <div className="player-container" style={{backgroundColor: "transparent"}}/>
        );
    }

    const Cards = () => {
        return player.isActive ? (
            <div  className="playerCards-container">
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
                <p className="player-text">{abbreviateChips(player?.chips)} {player.currentBet > 0 ? `(${abbreviateChips(player.currentBet)})` : null}</p>
            </div>
        );
    };

    const PositionChip = () => {
        return isDealer ? (
            <div className="positionChip-container">
                <p className="chip-text">D</p>
            </div>
        ) : isSmallBlind ? (
            <div className="positionChip-container" style={{ backgroundColor: "blue" }}>
                <p className="chip-text">SB</p>
            </div>
        ) : isBigBlind ? (
            <div className="positionChip-container" style={{ backgroundColor: "red" }}>
                <p className="chip-text">BB</p>
            </div>
        ) : null;
    };

    return (
        <div className="player-container" style={ isWinner ? { backgroundColor: "rgba(200, 50, 0, .4)" } : isTurn ? {backgroundColor: "rgba(255, 255, 255, .4)"} : {}}>
            <p className="player-text" style={clientUsername === player.username ? {fontWeight: "bold", color: "turquoise"} : {}}>{player.username}{player.username == clientUsername && " (ME)"}</p>
            <Cards/>
            <Chips/>
            <PositionChip />
        </div>
    );
});

export default PlayerZone;