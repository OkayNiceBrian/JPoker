import { Card } from "./Card";

export type Player = {
    username: string;
    card1?: Card;
    card2?: Card;
    chips: number;
    currentBet?: number;
    isActive: boolean;
}