import { Card } from "@/types/Card";
import "./styles/CardComponent.css";
import { CSSProperties, memo } from "react";

interface Props {
    card?: Card;
}

const CardComponent = memo(function CardComponent({ card }: Props) {

    const cardColor: CSSProperties = card?.suit === "hearts" || card?.suit === "diamonds" ? { color: "red" } : { color: "black" }; 

    return (
        <div className="card-container" style={card && {backgroundColor: "#fff"}}>
            { card && (
            <>
                <span className="card-rank" style={cardColor}>{ card.rank.toChar }</span>
                <span className="card-suitText" style={cardColor}>{ card.suit }</span>
            </>
            )}
        </div>
    );
});

export default CardComponent;