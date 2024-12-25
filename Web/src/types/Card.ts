export type Rank = {
    toChar: "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
    toString: "deuce" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine" | "ten" | "jack" | "queen" | "king" | "ace";
    value: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
}

export type Card = { // Not sure to use this
    suit: "hearts" | "diamonds" | "spades" | "clubs";
    rank: Rank;
}