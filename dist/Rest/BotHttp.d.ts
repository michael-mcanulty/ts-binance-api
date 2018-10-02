import { HttpError } from "../Error/HttpError";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { CallOptions } from "./CallOptions";
import { IBinanceApiAuth } from "../Account/Interfaces/IBinanceApiAuth";
import { ResponseAsJSON } from "request";
export declare class BotHttp {
    static BASE: string;
    auth: IBinanceApiAuth;
    static fetch: Function;
    options: IBinanceOptions;
    static buildUrl(options: CallOptions): string;
    call(callOptions: CallOptions): Promise<any>;
    requestAsync(callOptions: CallOptions): Promise<ResponseAsJSON | HttpError>;
    private getSignature;
    private getTimestamp;
    static makeQueryString(params: any): string;
    ping(): Promise<boolean>;
    privateCall(options: CallOptions): Promise<any>;
    private time;
    timestamp(): Promise<number>;
    constructor(options: IBinanceOptions);
}
