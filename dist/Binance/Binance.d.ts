import { IBinanceOptions } from "./Interfaces/IBinanceOptions";
import { BotWebsocket } from "../Websocket/BotWebsocket";
import { Rest } from "../Rest/Rest";
export declare class Binance {
    readonly rest: Rest;
    readonly websocket: BotWebsocket;
    static INTERVALS: string[];
    static candleAPILimits: {
        '1m': number;
        '3m': number;
        '5m': number;
        '15m': number;
        '30m': number;
        '1h': number;
        '2h': number;
        '4h': number;
        '6h': number;
        '8h': number;
        '12h': number;
        '1d': number;
        '3d': number;
        '1w': number;
    };
    static intervalDays: any;
    static intervalToMilliseconds: any;
    static intervalToMinutes: any;
    static millisecondsToInterval: any;
    static minutesToInterval: any;
    static options: IBinanceOptions;
    private _rest;
    private _websocket;
    constructor(options: IBinanceOptions);
}
