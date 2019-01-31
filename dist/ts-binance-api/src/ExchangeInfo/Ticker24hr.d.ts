import { I24hrTickerResponse } from "./Interfaces/I24hrTickerResponse";
export declare class Ticker24hr {
    askPrice: number;
    bidPrice: number;
    closeTime: number;
    count: number;
    firstId: number;
    highPrice: number;
    lastId: number;
    lastPrice: number;
    lastQty: number;
    lowPrice: number;
    openPrice: number;
    openTime: number;
    prevClosePrice: number;
    priceChange: number;
    priceChangePercent: number;
    quoteVolume: number;
    symbol: string;
    volume: number;
    weightedAvgPrice: number;
    constructor(ticker: I24hrTickerResponse);
}
