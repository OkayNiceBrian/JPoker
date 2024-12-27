import { memo } from "react";
import { Card } from "@/types/Card";
import CardComponent from "./CardComponent";
import { abbreviateChips } from "@/helpers/GameUtil";
import "./styles/CardPotZone.css";

interface Props {
    potTotal: number;
    communityCards: Card[];
}

const CardPotZone = memo(function CardPotZone({ potTotal, communityCards }: Props) {
    const renderCommunityCards = () => {
        return (
            <div className="cardPotZone-communityCards">
                { communityCards.map((card: Card, index) => <CardComponent key={index} card={card} />) }
            </div>
        );
    };

    const renderChipGraphics = () => {
        // TODO: dynamic graphical representation of chip total with multiple columns/colors
        return (
            <div></div>
        )
    }

    return (
        <div className="cardPotZone-container">
            {renderCommunityCards()}
            {renderChipGraphics()}
            <span>{abbreviateChips(potTotal)}</span>
        </div>
    );
});

export default CardPotZone;