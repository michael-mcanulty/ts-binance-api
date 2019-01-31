import { Candle } from "./Candle";
import { Interval } from "./Interval";
export declare class CandleInterval {
    _interval: Interval;
    candles: Candle[];
    interval: string;
    lastUpdated: Date;
    nextUpdate: Date;
    symbol: string;
    constructor(candles: Candle[]);
}
