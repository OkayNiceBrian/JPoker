import { Card } from "./Card";
import { Player } from "./Player";

export type Lobby = {
    id: string;
    isPrivate: boolean;
    players: Player[];
    communityCards: Card[];
    turnIndex: number;
    turnTimerSeconds: number;
}