import { Card } from "./Card";

export type Player = {
    name: string;
    cards: Card[];
    chips: number;
}