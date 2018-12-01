import { I24hrTickerResponse } from "./Interfaces/I24hrTickerResponse";
export declare class TickerVolume {
    symbol: string;
    volume: number;
    static toTickerVolumeList(tickers: I24hrTickerResponse[]): TickerVolume[];
    constructor(ticker: I24hrTickerResponse);
}
