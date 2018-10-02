import * as Fetch from 'isomorphic-fetch'
import * as crypto from 'crypto'
import {HttpError} from "../Error/HttpError";
import {IServerTime} from "./Interfaces/IServerTime";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ITimestamp} from "./Interfaces/ITimestamp";
import {Signed} from "./Signed";
import {NewOrder} from "../Transaction/NewOrder";
import {CancelOrder} from "../Transaction/CancelOrder";
import {OpenOrder} from "../Transaction/OpenOrder";
import {DataStream} from "./DataStream";
import {ApiHeader} from "./ApiHeader";
import {CallOptions} from "./CallOptions";
import {QueryOrder} from "../Transaction/QueryOrder";
import {AccountInfoOptions} from "../Account/AccountInfoOptions";
import {IBinanceApiAuth} from "../Account/Interfaces/IBinanceApiAuth";
import {IDepositAddressReq} from "../Deposit/Interfaces/IDepositAddressReq";
import {IDepositHistoryReq} from '../Deposit/Interfaces/IDepositHistoryReq';
import {IWithdrawHistoryReq} from "../Withdraw/Interfaces/IWithdrawHistoryReq";
import {ICallOpts} from '../Rest/Interfaces/ICallOpts';

export class BotHttp {
	public static BASE: string = 'https://api.binance.com';
	public auth: IBinanceApiAuth;
	public static fetch: Function = Fetch;
	public options: IBinanceOptions;

	static buildUrl(path: string, noData: boolean, data: object): string {
		return `${BotHttp.BASE}${path.includes('/wapi') ? '' : '/api'}${path}${noData ? '' : BotHttp.makeQueryString(data)}`;
	}

	public async call(path: string, callOptions: CallOptions, payload?: any): Promise<any> {
		let result: any;
		try {
			result = await this.fetch(path, callOptions, payload);
			return result;
		} catch (err) {
			throw err;
		}
	}

	public async fetch(path: string, callOptions: CallOptions, payload: any): Promise<Response | HttpError> {
		try {
			let url: string = BotHttp.buildUrl(path, callOptions.noData, payload);
			let res: Response = await BotHttp.fetch(url, callOptions);
			let json = await res.json();

			if (res.ok === false) {
				let error: HttpError = new HttpError(parseInt(res.status.toString()), res.statusText);
				return Promise.reject(error);
			} else {
				return <Response>json;
			}
		} catch (err) {
			throw err;
		}
	}

	private getSignature(payload: any, timestamp: ITimestamp): string {
		let signature: string;
		signature = crypto.createHmac('sha256', this.options.auth.secret).update(BotHttp.makeQueryString(Object.assign(payload, timestamp)).substr(1)).digest('hex');
		return signature;
	}

	private async getTimestamp(): Promise<ITimestamp> {
		let time: ITimestamp = <ITimestamp>{};
		if (this.options.useServerTime) {
			try {
				time.timestamp = await this.timestamp();
				return time;
			} catch (err) {
				throw err;
			}
		} else {
			time.timestamp = Date.now();
			return time;
		}
	}

	public static makeQueryString(params: any): string {
		let result: string;
		let keys: string[];
		keys = Object.keys(params).filter(k => params[k]);
		if (!params) {
			result = "";
		} else {
			result = `?${keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')}`;
		}
		return result;
	}

	public async ping(): Promise<boolean> {
		try {
			let options: ICallOpts = <ICallOpts>{};
			options.method = "GET";
			options.json = true;
			options.noExtra = false;
			options.noData = true;

			let config: CallOptions = new CallOptions(options, this.options.auth.key);
			await this.call('/v1/ping', config);
			return true;
		} catch (err) {
			throw err;
		}
	}

	public async privateCall(path: string, callOptions: CallOptions, payload?: IWithdrawHistoryReq | IDepositHistoryReq | IDepositAddressReq | QueryOrder | NewOrder | Signed | CancelOrder | OpenOrder | DataStream | AccountInfoOptions): Promise<any> {
		let result: any;
		let signature: string;
		if (!payload) {
			payload = new Signed();
		}
		try {
			let tStamp: ITimestamp = await this.getTimestamp();
			callOptions.headers = new ApiHeader(this.options.auth.key);
			signature = await this.getSignature(payload, tStamp);

			if (!callOptions.noExtra) {
				payload.timestamp = tStamp.timestamp;
				payload.signature = signature;
			} else {
				delete payload.timestamp;
			}
			result = await this.fetch(path, callOptions, payload);
			return result;
		} catch (err) {
			throw err;
		}
	}

	private async time(): Promise<IServerTime> {
		try {
			let server: IServerTime;
			let options: ICallOpts = <ICallOpts>{};
			options.method = "GET";
			options.json = true;
			options.noExtra = false;
			options.noData = true;
			let opts: CallOptions = new CallOptions(options, this.options.auth.key);
			server = await this.call('/v1/time', opts);
			return server;
		} catch (err) {
			throw new Error(`Error in server time sync. Message: ${err}`);
		}
	}

	public async timestamp(): Promise<number> {
		try {
			let time: IServerTime = await this.time();
			return time.serverTime;
		} catch (err) {
			throw new Error(`Error in server time sync. Message: ${err}`);
		}
	}

	constructor(options: IBinanceOptions) {
		this.options = options;
	}
}
