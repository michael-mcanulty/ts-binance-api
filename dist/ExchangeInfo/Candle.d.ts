import { IStreamRawKlineResponse } from "./Interfaces/ICandleBinance";
export declare class Candle {
    close: number;
    date: Date;
    high: number;
    interval?: string;
    low: number;
    open: number;
    quoteAsset?: string;
    symbol?: string;
    volume: number;
    static fromHttpByInterval(rawData: any[][], symbol: string, interval: string, quoteAssetName?: string): Candle[];
    static fromStream(rawKlineResponse: IStreamRawKlineResponse, quoteAssetName?: string): Candle;
    constructor(date: number, open: string, high: string, low: string, close: string, volume: string, symbol?: string, interval?: string, quoteAssetName?: string);
}
