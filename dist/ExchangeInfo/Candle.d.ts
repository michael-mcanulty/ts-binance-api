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
    constructor(openTime: number, open: string, high: string, low: string, close: string, volume: string, closeTime: number, symbol?: string, interval?: string);
}
