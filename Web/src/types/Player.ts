import { Card } from "./Card";

export type Player = {
    name: string;
    card1?: Card;
    card2?: Card;
    chips: number;
    currentBet?: number;
    isActive: boolean;
}