import { HttpError } from "../Error/HttpError";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { CallOptions } from "./CallOptions";
import { IBinanceApiAuth } from "../Account/Interfaces/IBinanceApiAuth";
import { OptionsWithUri, ResponseAsJSON } from "request";
export declare class BotHttp {
    static BASE: string;
    auth: IBinanceApiAuth;
    options: IBinanceOptions;
    call(callOptions: CallOptions): Promise<any>;
    binanceRequest(callOptions: CallOptions): Promise<ResponseAsJSON | HttpError>;
    static requestApi(coreOptions: OptionsWithUri): Promise<ResponseAsJSON>;
    private getSignature;
    private getTimestamp;
    static makeQueryString(params: any): string;
    ping(): Promise<boolean>;
    privateCall(options: CallOptions): Promise<any>;
    private time;
    timestamp(): Promise<number>;
    constructor(options: IBinanceOptions);
}
