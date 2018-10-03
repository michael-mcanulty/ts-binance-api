import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { CallOptions } from "./CallOptions";
import { OptionsWithUri, Response } from "request";
export declare class BotHttp {
    static BASE: string;
    options: IBinanceOptions;
    call(callOptions: CallOptions): Promise<any>;
    binanceRequest(callOptions: CallOptions): Promise<Response>;
    static requestApi(uriOptions: OptionsWithUri): Promise<Response>;
    private getSignature;
    private getTimestamp;
    static makeQueryString(params: any): string;
    ping(): Promise<boolean>;
    privateCall(options: CallOptions): Promise<any>;
    private time;
    timestamp(): Promise<number>;
    constructor(options: IBinanceOptions);
}
