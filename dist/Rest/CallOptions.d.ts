import { ICallOpts } from "./Interfaces/ICallOpts";
import { TMethod } from "./TMethod";
import { IWithdrawHistoryReq } from "../Withdraw/Interfaces/IWithdrawHistoryReq";
import { IDepositHistoryReq } from "../Deposit/Interfaces/IDepositHistoryReq";
import { AccountInfoOptions } from "../Account/AccountInfoOptions";
import { IDepositAddressReq } from "../Deposit/Interfaces/IDepositAddressReq";
import { Signed } from "./Signed";
import { DataStream } from "./DataStream";
import { QueryOrder } from "../Transaction/QueryOrder";
import { NewOrder } from "../Transaction/NewOrder";
import { CancelOrder } from "../Transaction/CancelOrder";
import { OpenOrder } from "../Transaction/OpenOrder";
import { Headers } from "request";
import * as requestPromise from "request-promise-native";
import { ICandleRequest } from "../ExchangeInfo/Interfaces/ICandleRequest";
import { IGetAllOrdersOpts } from "../Transaction/Interfaces/IGetAllOrdersOpts";
export declare class CallOptions implements ICallOpts {
    headers?: Headers;
    uri: string;
    json?: boolean;
    method: TMethod;
    isSigned?: boolean;
    apiKey?: string;
    resolveWithFullResponse?: boolean;
    qs?: IGetAllOrdersOpts | IWithdrawHistoryReq | IDepositHistoryReq | IDepositAddressReq | QueryOrder | NewOrder | Signed | CancelOrder | OpenOrder | DataStream | AccountInfoOptions | ICandleRequest;
    toObjLiteral(): requestPromise.OptionsWithUri;
    constructor(options: ICallOpts);
}
