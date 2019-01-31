import * as crypto from 'crypto'
import {IServerTime} from "./Interfaces/IServerTime";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ITimestamp} from "./Interfaces/ITimestamp";
import {Signed} from "./Signed";
import {ApiHeader} from "./ApiHeader";
import {CallOptions} from "./CallOptions";
import {ICallOpts} from '../Rest/Interfaces/ICallOpts';
import {Response} from "request";
import * as requestPromise from "request-promise-native";
import  {OptionsWithUri} from "request-promise-native";

export class BotHttp {
	public static BASE: string = 'https://api.binance.com';
	public options: IBinanceOptions;

	public async call(callOptions: CallOptions): Promise<any> {
		let result: any;
		try {
			result = await this.binanceRequest(callOptions);
			return result;
		} catch (err) {
			throw err;
		}
	}

	//TODO: CallOpts rename to something like requestOpts. Extend request or add properties to callOpts like 'form'.
	public async binanceRequest(callOptions: CallOptions):Promise<Response>{
		let res: Response;
		let requestOpts: requestPromise.OptionsWithUri = callOptions.toObjLiteral();

		try {
			res = await BotHttp.requestApi(requestOpts);
			return res;
		}catch(err){
			throw err;
		}
	}
  public static async requestApi(uriOptions: OptionsWithUri): Promise<any>{
		let error: Error;
		let res: Response;
		try{
			res = await requestPromise[uriOptions.method.toLowerCase()](uriOptions);
			if (res.statusCode !== 200) {
				error = new Error(res.statusMessage);
				error.name = res.statusCode.toString();
				return Promise.reject(error);
			}else {
				return res.body;
			}
		}catch(err){
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
		let config: CallOptions;
		let options: ICallOpts = <ICallOpts>{};
		options.method = "GET";
		options.json = true;
		options.isSigned = true;
		options.uri = `${BotHttp.BASE}/api/v1/ping`;
		options.apiKey = this.options.auth.key;

		try {
			config = new CallOptions(options);
			await this.call(config);
			return true;
		} catch (err) {
			throw err;
		}
	}

	public async privateCall(options: CallOptions): Promise<any> {
		let tStamp: ITimestamp;
		let result: any;
		let signature: string;

		try {
			options.headers = new ApiHeader(this.options.auth.key);

			if (options.isSigned) {
				if(typeof options.qs == undefined){
					options.qs = new Signed();
				}
				tStamp = await this.getTimestamp();
				signature = await this.getSignature(options.qs, tStamp);
				options.qs['timestamp'] = tStamp.timestamp;
				options.qs['signature'] = signature;
			} else if(options && typeof options.qs === "object" && options.qs['timestamp']){
				delete options.qs['timestamp'];
			}
			result = await this.binanceRequest(options);
			return result;
		} catch (err) {
			throw err;
		}
	}

	private async time(): Promise<IServerTime> {
		let opts: CallOptions;
		let options: ICallOpts = <ICallOpts>{};

		try {
			options.method = "GET";
			options.json = true;
			options.isSigned = true;
			options.apiKey = this.options.auth.key;
			options.uri = `${BotHttp.BASE}/api/v1/time`;

			opts = new CallOptions(options);
			return <IServerTime> await this.call(opts);
		} catch (err) {
			throw err;
		}
	}

	public async timestamp(): Promise<number> {
		try {
			let time: IServerTime = await this.time();
			return time.serverTime;
		} catch (err) {
			throw err;
		}
	}

	constructor(options: IBinanceOptions) {
		this.options = options;
	}
}
