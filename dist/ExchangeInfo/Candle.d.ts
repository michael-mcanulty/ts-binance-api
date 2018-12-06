import { IStreamRawKlineResponse } from "../ExchangeInfo/Interfaces/ICandleBinance";
export declare class Candle {
    close: number;
    openTime: Date;
    high: number;
    interval?: string;
    low: number;
    open: number;
    symbol?: string;
    volume: number;
    closeTime: Date;
    static fromRestStream(rawData: any[][], symbol: string, interval: string): Candle[];
    static fromWebsocket(klineStream: IStreamRawKlineResponse): Candle;
    static fromApiCandle(openTime: number, open: string, high: string, low: string, close: string, volume: string, closeTime: number, symbol?: string, interval?: string): Candle;
    constructor(openTime: Date, open: number, high: number, low: number, close: number, volume: number, closeTime: Date, symbol?: string, interval?: string);
}
