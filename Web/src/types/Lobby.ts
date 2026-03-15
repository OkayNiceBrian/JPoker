import { Card } from "./Card";
import { Player } from "./Player";

export type Lobby = {
    id: string;
    isPrivate: boolean;
    players: Player[];
    communityCards: Card[];
    pot: number;
    activeBet: number;
    smallBlind: number;
    bigBlind: number;
    turnIndex: number;
    smallBlindIndex: number;
    turnTimerSeconds: number;
}