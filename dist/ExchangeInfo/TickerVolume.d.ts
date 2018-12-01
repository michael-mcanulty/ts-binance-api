import { I24hrTickerResponse } from "./Interfaces/I24hrTickerResponse";
export declare class TickerVolume {
    symbol: string;
    volume: number;
    constructor(ticker: I24hrTickerResponse);
}
