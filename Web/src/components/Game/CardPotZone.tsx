import { useEffect, useState } from "react";
import { Card } from "@/types/Card";
import CardComponent from "./CardComponent";
import "./styles/CardPotZone.css";

const CardPotZone = () => {
    const [potTotal, setPotTotal] = useState(0);
    const [communityCards, setCommunityCards] = useState<Card[]>([]);

    useEffect(() => {
        setCommunityCards([
            {
                suit: "spades",
                rank: {
                    value: 14,
                    toChar: "A",
                    toString: "ace",
                }
            },
            {
                suit: "hearts",
                rank: {
                    value: 7,
                    toChar: "7",
                    toString: "seven",
                }
            },
            {
                suit: "clubs",
                rank: {
                    value: 12,
                    toChar: "Q",
                    toString: "queen",
                }
            },
        ]);
    }, []);

    const renderCommunityCards = () => {
        return (
            <div className="cardPotZone-communityCards">
                { communityCards.map((card: Card) => <CardComponent card={card} />) }
            </div>
        );
    };

    return (
        <div className="cardPotZone-container">
            {renderCommunityCards()}
        </div>
    );
};

export default CardPotZone;