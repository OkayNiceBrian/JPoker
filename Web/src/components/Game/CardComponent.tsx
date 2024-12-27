import { CSSProperties, memo } from "react";
import { Clubs02Icon, Diamond01Icon, FavouriteIcon, SpadesIcon } from "hugeicons-react";
import { Card } from "@/types/Card";
import "./styles/CardComponent.css";

interface Props {
    card?: Card;
}

const CardComponent = memo(function CardComponent({ card }: Props) {

    const cardColor: CSSProperties = card?.suit === "hearts" || card?.suit === "diamonds" ? { color: "red" } : { color: "black" }; 

    return (
        <div className="card-container" style={card && {backgroundColor: "#fff"}}>
            { card && (
            <>
                <div className="card-rank-container">
                    <span className="card-rank" style={cardColor}>{ card.rank.toChar }</span>
                </div>
                <div className="card-suit-container">
                { 
                    card.suit === "hearts" ? <FavouriteIcon style={cardColor} size={"2vw"}/> :
                    card.suit === "diamonds" ? <Diamond01Icon style={cardColor} size={"2vw"}/> :
                    card.suit === "spades" ? <SpadesIcon style={cardColor} size={"2vw"}/> :
                    card.suit === "clubs" ? <Clubs02Icon style={cardColor} size={"2vw"}/> : null
                }
                </div>
            </>
            )}
        </div>
    );
});

export default CardComponent;