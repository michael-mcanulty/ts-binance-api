import { Candle } from "./Candle";
export declare class RestCandle {
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime?: number;
    qaVolume?: string;
    numTrades?: number;
    takerBuyBAVolume?: string;
    takerBuyQAVolume?: string;
    ignore?: string;
    static fromRest(rawData: any[][]): RestCandle[];
    toCandle(symbol: string, interval: string): Candle;
    constructor(openTime: number, open: string, high: string, low: string, close: string, volume: string, closeTime?: number, qaVolume?: string, numTrades?: number, takerBuyBAVolume?: string, takerBuyQAVolume?: string, ignore?: string);
}
