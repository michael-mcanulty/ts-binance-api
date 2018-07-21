import { HttpError } from "../Error/HttpError";
import { BinanceApiAuth } from "../Account/BinanceApiAuth";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { Signed } from "./Signed";
import { NewOrder } from "../Transaction/NewOrder";
import { CancelOrder } from "../Transaction/CancelOrder";
import { OpenOrder } from "../Transaction/OpenOrder";
import { DataStream } from "./DataStream";
import { CallOptions } from "./CallOptions";
import { QueryOrder } from "../Transaction/QueryOrder";
import { AccountInfoOptions } from "../Account/AccountInfoOptions";
import { IOrder } from "../Transaction/Interfaces/IOrder";
export declare class BotHttp {
    static BASE: string;
    static fetch: Function;
    auth: BinanceApiAuth;
    options: IBinanceOptions;
    static buildUrl(path: string, noData: boolean, data: object): string;
    call(path: string, callOptions: CallOptions, payload?: any): Promise<any>;
    fetch(path: string, callOptions: CallOptions, payload: any): Promise<Response | HttpError>;
    private getSignature(payload, timestamp);
    private getTimestamp();
    static makeQueryString(params: any): string;
    ping(): Promise<boolean>;
    privateCall(path: string, callOptions: CallOptions, payload?: IOrder | QueryOrder | NewOrder | Signed | CancelOrder | OpenOrder | DataStream | AccountInfoOptions): Promise<any>;
    private time();
    timestamp(): Promise<number>;
    constructor(options: IBinanceOptions);
}
