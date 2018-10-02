import * as Fetch from 'isomorphic-fetch'
import * as crypto from 'crypto'
import {HttpError} from "../Error/HttpError";
import {IServerTime} from "./Interfaces/IServerTime";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ITimestamp} from "./Interfaces/ITimestamp";
import {Signed} from "./Signed";
import {ApiHeader} from "./ApiHeader";
import {CallOptions} from "./CallOptions";
import {IBinanceApiAuth} from "../Account/Interfaces/IBinanceApiAuth";
import {ICallOpts} from '../Rest/Interfaces/ICallOpts';
import {RequestAPI, RequiredUriUrl, Response, ResponseAsJSON} from "request";
import {TMethod} from "./TMethod";
import * as requestPromise from "request-promise-native";

export class BotHttp {
	public static BASE: string = 'https://api.binance.com';
	public auth: IBinanceApiAuth;
	public static fetch: Function = Fetch;
	public options: IBinanceOptions;

	static buildUrl(options: CallOptions): string {
		return `${BotHttp.BASE}${options.uri.includes('/wapi') ? '' : '/api'}${options.uri}${(options.qs instanceof Object) ? '' : BotHttp.makeQueryString(options.qs)}`;
	}

	public async call(callOptions: CallOptions): Promise<any> {
		let result: any;
		try {
			result = await this.requestAsync(callOptions);
			return result;
		} catch (err) {
			throw err;
		}
	}
	//TODO: CallOpts rename to something like requestOpts. Extend request or add properties to callOpts like 'form'.
	public async requestAsync(callOptions: CallOptions):Promise<ResponseAsJSON | HttpError>{
		let json: ResponseAsJSON;
		let error: HttpError;
		let newHeaders: object;
		let requestApi: RequestAPI<requestPromise.RequestPromise, requestPromise.RequestPromiseOptions, RequiredUriUrl>;
		let method: TMethod = <TMethod> callOptions.method;

		let requestOpts: requestPromise.OptionsWithUri = <requestPromise.OptionsWithUri>{};
		requestOpts.uri = callOptions.uri;
		requestOpts.method = callOptions.method;
		requestOpts.headers = callOptions.headers;
		requestOpts.json = callOptions.json;

		requestApi = requestPromise[method.toLowerCase()];
		let res: Response = await requestApi(requestOpts);
		json = await res.toJSON();
		if (res.statusCode !== 200) {
			error = new HttpError(res.statusCode, res.statusMessage);
			return Promise.reject(error);
		}else {
			return <ResponseAsJSON>json;
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
		options.uri = '/v1/ping';
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
			tStamp = await this.getTimestamp();
			options.headers = new ApiHeader(this.options.auth.key);
			signature = await this.getSignature(options.qs, tStamp);

			if (options.isSigned) {
				if(typeof options.qs == undefined){
					options.qs = new Signed();
				}
				options.qs['timestamp'] = tStamp.timestamp;
				options.qs['signature'] = signature;
			} else {
				delete options.qs['timestamp'];
			}
			result = await this.requestAsync(options);
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
			options.uri = '/v1/time';

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
