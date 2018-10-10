import {ICallOpts} from "./Interfaces/ICallOpts";
import {ApiHeader} from "./ApiHeader";
import {TMethod} from "./TMethod";
import {IWithdrawHistoryReq} from "../Withdraw/Interfaces/IWithdrawHistoryReq";
import {IDepositHistoryReq} from "../Deposit/Interfaces/IDepositHistoryReq";
import {AccountInfoOptions} from "../Account/AccountInfoOptions";
import {IDepositAddressReq} from "../Deposit/Interfaces/IDepositAddressReq";
import {Signed} from "./Signed";
import {DataStream} from "./DataStream";
import {QueryOrder} from "../Transaction/QueryOrder";
import {NewOrder} from "../Transaction/NewOrder";
import {CancelOrder} from "../Transaction/CancelOrder";
import {OpenOrder} from "../Transaction/OpenOrder";
import {Headers} from "request";
import * as requestPromise from "request-promise-native";
import {ICandleRequest} from "../ExchangeInfo/Interfaces/ICandleRequest";
import {IGetAllOrdersOpts} from "../Transaction/Interfaces/IGetAllOrdersOpts";
import {IGetTotalBalanceOpts} from "../Balances/Interfaces/IGetTotalBalanceOpts";

export class CallOptions{
	headers?: Headers;
	uri: string;
	json?: boolean;
	method: TMethod;
	isSigned?: boolean;
	apiKey?: string;
	resolveWithFullResponse?: boolean;
	qs?: IGetTotalBalanceOpts | IGetAllOrdersOpts | IWithdrawHistoryReq | IDepositHistoryReq | IDepositAddressReq | QueryOrder | NewOrder | Signed | CancelOrder | OpenOrder | DataStream | AccountInfoOptions | ICandleRequest ;

	public toRequestOptions(): requestPromise.OptionsWithUri{
		let requestOpts: requestPromise.OptionsWithUri = <requestPromise.OptionsWithUri>{};
		requestOpts.uri = this.uri;
		requestOpts.method = <string> this.method;
		requestOpts.headers = this.headers;
		requestOpts.json = this.json;
		requestOpts.qs = this.qs;
		requestOpts.resolveWithFullResponse = this.resolveWithFullResponse;
		return requestOpts;
	}

	constructor(options: ICallOpts) {
		this.uri = options.uri;
		this.headers = <Headers> options.headers;
		this.method = <TMethod> options.method;
		this.json = options.json || true;
		this.isSigned = options.isSigned || false;
		this.apiKey = options.apiKey || null;
		this.qs = options.qs || null;
		this.resolveWithFullResponse = options.resolveWithFullResponse || true;
		if (this.apiKey || options.headers) {
			this.headers = options.headers || new ApiHeader(this.apiKey);
		}
	}
}