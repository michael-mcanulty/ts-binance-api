import { HttpError } from "../Error/HttpError";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { Signed } from "./Signed";
import { NewOrder } from "../Transaction/NewOrder";
import { CancelOrder } from "../Transaction/CancelOrder";
import { OpenOrder } from "../Transaction/OpenOrder";
import { DataStream } from "./DataStream";
import { CallOptions } from "./CallOptions";
import { QueryOrder } from "../Transaction/QueryOrder";
import { AccountInfoOptions } from "../Account/AccountInfoOptions";
import { IBinanceApiAuth } from "../Account/Interfaces/IBinanceApiAuth";
import {IDepositAddressReq} from "../Deposit/Interfaces/IDepositAddressReq";
import {IDepositHistoryReq} from '../Deposit/Interfaces/IDepositHistoryReq';
import {IWithdrawlHistoryReq} from "../Withdrawl/Interfaces/IWithdrawlHistoryReq";
export declare class BotHttp {
    static BASE: string;
    static fetch: Function;
    auth: IBinanceApiAuth;
    options: IBinanceOptions;
    static buildUrl(path: string, noData: boolean, data: object): string;
    call(path: string, callOptions: CallOptions, payload?: any): Promise<any>;
    fetch(path: string, callOptions: CallOptions, payload: any): Promise<Response | HttpError>;
    private getSignature(payload, timestamp);
    private getTimestamp();
    static makeQueryString(params: any): string;
    ping(): Promise<boolean>;

	privateCall(path: string, callOptions: CallOptions, payload?: IWithdrawlHistoryReq | IDepositHistoryReq | IDepositAddressReq | QueryOrder | NewOrder | Signed | CancelOrder | OpenOrder | DataStream | AccountInfoOptions): Promise<any>;
    private time();
    timestamp(): Promise<number>;
    constructor(options: IBinanceOptions);
}
