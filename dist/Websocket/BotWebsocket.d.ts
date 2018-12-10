import { default as ReconnectingWebSocket } from "./ReconnectingWebSocket/ReconnectingWebSocket";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { Rest } from "../Rest/Rest";
export declare class BotWebsocket extends Rest {
    static BASE: string;
    private readonly _reconOptions;
    private _ws;
    private _url;
    url: string;
    _getTickerUrl(symbol?: string | null): string;
    _getTickers(callback: Function): any;
    balances(callback: Function): void;
    candles(symbols: string[], intervals: string[], callback: Function): any;
    openWebSocket(url: any): ReconnectingWebSocket;
    orders(callback: Function): void;
    prices(callback: Function): void;
    user(callback: Function): void;
    constructor(options: IBinanceOptions);
}
