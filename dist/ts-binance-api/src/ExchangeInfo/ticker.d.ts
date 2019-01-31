import { Price } from "../Transaction/Price";
import { IStreamTicker, IStreamTickerRaw } from "./Interfaces/IStreamTickerRaw";
export declare class Ticker implements IStreamTicker {
    bestAsk: string;
    bestAskQnt: string;
    bestBid: string;
    bestBidQnt: string;
    closeTime: number;
    closeTradeQuantity: string;
    curDayClose: string;
    eventTime: number;
    eventType: string;
    firstTradeId: number;
    high: string;
    lastTradeId: number;
    low: string;
    open: string;
    openTime: number;
    prevDayClose: string;
    priceChange: string;
    priceChangePercent: string;
    symbol: string;
    totalTrades: number;
    volume: string;
    volumeQuote: string;
    weightedAvg: string;
    toPrice(): Price;
    constructor(rawStreamTicker: IStreamTickerRaw);
}
