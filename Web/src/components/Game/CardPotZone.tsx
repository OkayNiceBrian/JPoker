import { memo } from "react";
import { Card } from "@/types/Card";
import CardComponent from "./CardComponent";
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

    return (
        <div className="cardPotZone-container">
            {renderCommunityCards()}
            <span>{potTotal}</span>
        </div>
    );
});

export default CardPotZone;