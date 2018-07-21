import * as Fetch from 'isomorphic-fetch'
import * as crypto from 'crypto'
import {HttpError} from "../Error/HttpError";
import {IServerTime} from "./Interfaces/IServerTime";
import {EMethod} from "./EMethod";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ITimestamp} from "./Interfaces/ITimestamp";
import {BinanceError} from "../Error/BinanceError";
import {Signed} from "./Signed";
import {NewOrder} from "../Transaction/NewOrder";
import {CancelOrder} from "../Transaction/CancelOrder";
import {OpenOrder} from "../Transaction/OpenOrder";
import {DataStream} from "./DataStream";
import {ApiHeader} from "./ApiHeader";
import {CallOptions} from "./CallOptions";
import {QueryOrder} from "../Transaction/QueryOrder";
import {AccountInfoOptions} from "../Account/AccountInfoOptions";
import {IOrder} from "../Transaction/Interfaces/IOrder";
import {IBinanceApiAuth} from "../Account/Interfaces/IBinanceApiAuth";

export class BotHttp {
	public static BASE: string = 'https://api.binance.com';
	public static fetch: Function = Fetch;
	public auth: IBinanceApiAuth;
	public options: IBinanceOptions;

	static buildUrl(path: string, noData: boolean, data: object): string {
		return `${BotHttp.BASE}${path.includes('/wapi') ? '' : '/api'}${path}${noData ? '' : BotHttp.makeQueryString(data)}`;
	}

	public call(path: string, callOptions: CallOptions, payload?: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			let result: any;
			try {
				result = await this.fetch(path, callOptions, payload);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	public fetch(path: string, callOptions: CallOptions, payload: any): Promise<Response | HttpError> {
		return new Promise(async (resolve, reject)=>{

			try{
				let err: HttpError;
				let url: string = BotHttp.buildUrl(path, callOptions.noData, payload);
				let res: Response = await BotHttp.fetch(url, callOptions);
				let json = await res.json();
				let binanceError: BinanceError;
				let errObj: HttpError = <HttpError>{"message": res.statusText, "code": res.status};

				if (json) {
					binanceError = <BinanceError>json;
				}

				if (res.ok === false) {
					if (!binanceError) {
						err = new HttpError(errObj);
						reject(err);
					} else if (binanceError) {
						err = new HttpError(binanceError);
						reject(err);
					}

				}else{
					resolve(<Response>json);
				}
			}catch(err){
				reject(err);
			}
		});
	}

	private getSignature(payload: any, timestamp: ITimestamp): string {
		let signature: string = crypto.createHmac('sha256', this.options.auth.secret).update(BotHttp.makeQueryString(Object.assign(payload, timestamp)).substr(1)).digest('hex');
		return signature;
	}

	private getTimestamp(): Promise<ITimestamp> {
		return new Promise(async (resolve, reject) => {
			let time: ITimestamp = <ITimestamp>{};
			if (this.options.useServerTime) {
				try {
					time.timestamp = await this.timestamp();
					resolve(time);
				} catch (err) {
					reject(err);
				}
			} else {
				time.timestamp = Date.now();
				resolve(time);
			}
		});
	}

	public static makeQueryString(params: any): string {
		let result:string;
		let keys: string[];
		keys = Object.keys(params).filter(k => params[k]);
		if(!params){
			result = "";
		}else{
			result = `?${keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')}`;
		}
		return result;
	}

	public ping(): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try{
				let opts: CallOptions = new CallOptions(EMethod.GET, true, true, false, this.options.auth.key);
				await this.call('/v1/ping', opts);
				resolve(true);
			}catch(err){
				reject(err);
			}
		});
	}

	public privateCall(path: string, callOptions: CallOptions, payload?: IOrder | QueryOrder | NewOrder | Signed | CancelOrder | OpenOrder | DataStream | AccountInfoOptions): Promise<any> {
		return new Promise(async (resolve, reject) => {
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
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	private time(): Promise<IServerTime> {
		return new Promise(async (resolve, reject) => {
			try{
				let opts: CallOptions = new CallOptions(EMethod.GET, true, true, false, this.options.auth.key);
				let server: IServerTime = await this.call('/v1/time', opts);
				resolve(server);
			}catch(err){
				reject(`Error in server time sync. Message: ${err}`);
			}
		});
	}

	public timestamp(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {
				let time: IServerTime = await this.time();
				resolve(time.serverTime);
			} catch (err) {
				reject(`Error in server time sync. Message: ${err}`);
			}
		});
	}

	constructor(options: IBinanceOptions) {
		this.options = options;
	}
}
