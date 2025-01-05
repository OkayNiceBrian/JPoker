import { Card } from "./Card";
import { Player } from "./Player";

export type Lobby = {
    id: string;
    isPrivate: boolean;
    players: Player[];
    communityCards: Card[];
    pot: number;
    turnIndex: number;
    turnTimerSeconds: number;
}