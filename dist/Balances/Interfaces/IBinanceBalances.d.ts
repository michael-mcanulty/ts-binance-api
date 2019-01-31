export interface IBinanceBalances {
    [key: string]: {
        available: string;
        locked: string;
    };
}
