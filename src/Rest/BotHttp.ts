import * as Fetch from 'isomorphic-fetch'
import * as crypto from 'crypto'
import {HttpError} from "../Error/HttpError";
import {Auth} from "../Account/Auth";
import {IServerTime} from "./Interfaces/IServerTime";
import {EMethod} from "./EMethod";
import {ICallOpts} from "./Interfaces/ICallOpts";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ITimestamp} from "./Interfaces/ITimestamp";

export class BotHttp {
	public static BASE: string = 'https://api.binance.com';
	public static fetch: Function = Fetch;
	public auth: Auth;
	public options: IBinanceOptions;

	public buildUrl(path:string, data:object, noData:boolean):string{
		return `${BotHttp.BASE}${path.includes('/wapi') ? '' : '/api'}${path}${noData ? '' : BotHttp.makeQueryString(data)}`;
	}

	public call(path: string, data?: any, callOptions?: ICallOpts): Promise<any> {
		return new Promise(async (resolve, reject) => {
			let result: any;
			if (!callOptions) {
				callOptions = <ICallOpts>{};
				callOptions.noData = false;
			}
			try {
				result = await this.fetch(path, data, callOptions);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	public fetch(path: string, payload: any, callOptions: ICallOpts): Promise<Response> {
		return new Promise(async (resolve, reject)=>{
			let json:any;
			let err:HttpError;
			if(typeof callOptions.noData !== "boolean"){
				callOptions.noData = false;
			}
			let params:string = this.buildUrl(path, payload, callOptions.noData);
			let reqOpts: RequestInit = <RequestInit>{};
			reqOpts.method = EMethod[callOptions.method];
			reqOpts.headers = callOptions.headers || new Headers();

			try{
				let res: Response = await BotHttp.fetch(params, reqOpts);
				if (res.ok === false) {
					err = new HttpError({"message": res.statusText, "code": res.status});
					if (typeof err.handler === "function") {
						err['handler'].executeApi(err).then(success => {
							reject(err);
						});
					} else {
						reject(new HttpError({"message": res.statusText, "code": res.status}));
					}
				}else{
					json = await res.json();
					resolve(json);
				}
			}catch(err){
				reject(err);
			}
		})
	}

	private getTimestamp(): Promise<ITimestamp> {
		const context = this;
		return new Promise(async (resolve, reject) => {
			let time: ITimestamp = <ITimestamp>{};
			if (context.options.useServerTime) {
				try {
					time.timestamp = await context.timestamp();
				} catch (err) {
					reject(err);
				}
			} else {
				time.timestamp = Date.now();
			}
			resolve(time);
		});
	}

	private mergePrivatePayload(dataPayload: any): Promise<object> {
		const context = this;
		return new Promise(async (resolve, reject) => {
			let merged: any;
			let data: any;
			try {
				let timestamp: ITimestamp = await context.getTimestamp();
				if (data && data !== null) {
					data = Object.assign({}, dataPayload);
					merged = Object.assign(data, timestamp);
					resolve(merged);
				} else {
					merged = Object.assign({}, timestamp);
					resolve(merged);
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	public privateCall(path: string, payload: any, callOptions: ICallOpts): Promise<any> {
		return new Promise(async (resolve, reject) => {
			let result: any;
			let signature: string;
			let payloadData: any;
			let newData: any;

			if (!callOptions) {
				callOptions = <ICallOpts>{};
				callOptions.noData = false;
				callOptions.headers = {'X-MBX-APIKEY': this.options.auth.key};
				callOptions.method = EMethod.GET;
				callOptions.json = true;
			} else {
				callOptions.headers = {'X-MBX-APIKEY': this.options.auth.key};
			}

			payloadData = await this.mergePrivatePayload(payload);
			if (!this.options.auth.key || !this.options.auth.secret) {
				throw new Error('You need to pass an API key and secret to make authenticated calls.');
			}

			try {
				signature = crypto.createHmac('sha256', this.options.auth.secret)
					.update(BotHttp.makeQueryString(payloadData)
						.substr(1)).digest('hex');
				newData = callOptions.noExtra ? payload : Object.assign(payloadData, {"signature": signature});

				result = await this.fetch(path, newData, callOptions);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}
	public static makeQueryString(params: any): string {
		let result:string;
		if(!params){
			result = "";
		}else{
			result = `?${Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')}`;
		}
		return result;
	}

	public ping(): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try{
				let opts: ICallOpts = <ICallOpts>{};
				opts.noData = true;
				let res: Response = await this.call('/v1/ping', null, opts);
				resolve(true);
			}catch(err){
				reject(err);
			}
		});
	}

	private time(): Promise<IServerTime> {
		return new Promise(async (resolve, reject) => {
			try{
				let opts: ICallOpts = <ICallOpts>{};
				opts.noData = true;
				opts.json = true;
				opts.method = EMethod.GET;
				opts.noExtra = false;
				let server: IServerTime = await this.call('/v1/time', null, opts);
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
