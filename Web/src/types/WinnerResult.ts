import { Hand } from "./Hand";
import { Player } from "./Player";

export type WinnerResult = {
    winners: Player[];
    winningHand: Hand;
}