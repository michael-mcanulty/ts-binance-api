import { default as ReconnectingWebSocket } from "./ReconnectingWebSocket/ReconnectingWebSocket";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { Rest } from "../Rest/Rest";
export declare class BotWebsocket extends Rest {
    private static _INSTANCE;
    private readonly _reconOptions;
    private static _ws;
    static BASE: string;
    private static isAlive;
    options: IBinanceOptions;
    private _url;
    static readonly Instance: BotWebsocket;
    url: string;
    _getTickerUrl(symbol?: string | null): string;
    _getTickers(callback: Function): any;
    balances(callback: Function): void;
    orders(callback: Function): void;
    user(callback: Function): void;
    candles(symbols: string[], intervals: string[], callback: Function): any;
    private static heartbeat();
    openWebSocket(url: any): ReconnectingWebSocket;
    prices(callback: Function): void;
    constructor(options?: IBinanceOptions);
}
