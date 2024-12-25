import CardComponent from "./CardComponent";
import "./styles/PlayerZone.css";

const PlayerZone = ({}) => {

    const Cards = () => {
        return (
            <div className="playerCards-container">
                <CardComponent/>
                <CardComponent/>
            </div>
        );
    }

    const Chips = () => {
        return (
            <div className="playerChips-container">
                <div className="playerChips-image"></div>
                <span className="playerChips-count">1.3m</span>
            </div>
        );
    }

    return (
        <div className="player-container">
            <span>JPokerStar</span>
            <Cards/>
            <Chips/>
        </div>
    );
};

export default PlayerZone;