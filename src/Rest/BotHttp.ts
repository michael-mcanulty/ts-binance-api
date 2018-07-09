import * as Fetch from 'isomorphic-fetch'
import * as crypto from 'crypto'
import {HttpError} from "../Error/HttpError";
import {Auth} from "../Account/Auth";
import {IServerTime} from "./Interfaces/IServerTime";
import {EMethod} from "./EMethod";
import {ICallOpts} from "./Interfaces/ICallOpts";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";

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
			reqOpts.method = EMethod[EMethod.GET];
			reqOpts.headers = new Headers();

			try{
				let res: Response = await BotHttp.fetch(params, reqOpts);
				json = await res.json();

				if (res.ok === false) {
					err = new HttpError(json);
					if (typeof err.handler === "function") {
						err['handler'].executeApi(err).then(success => {
							reject(err);
						});
					} else {
						reject(new HttpError(json));
					}
				}else{
					resolve(json);
				}
			}catch(err){
				if (typeof err.json === "function") {
					json = await err.json();
					let _error: HttpError = new HttpError(json);
					if (_error && typeof _error.handler === "function") {
						_error['handler'].executeApi(err).then(success => {
							reject(err);
						});
					} else {
						reject(new HttpError(_error));
					}
				} else {
					let _error: HttpError = new HttpError(err);
					if (_error && typeof _error.handler === "function") {
						_error['handler'].executeApi(err).then(success => {
							reject(err);
						});
					} else {
						reject(new HttpError(_error));
					}
				}
			}
		})
	}

	public privateCall(path: string, data: any, callOptions: ICallOpts): Promise<any> {
		return new Promise(async (resolve, reject) => {
			let result: any;
			let signature: string;
			let timestamp: IServerTime = <IServerTime>{};
			let newData: any;
			let headersInit: HeadersInit = [['X-MBX-APIKEY', this.options.auth.key]];
			let headers: Headers = new Headers(headersInit);
			if (!callOptions) {
				callOptions = <ICallOpts>{};
				callOptions.noData = false;
			}

			let fetchPath: string = this.buildUrl(path, data, callOptions.noData);
			callOptions.headers = headers;
			callOptions.method = EMethod.GET;
			callOptions.json = true;

			if (!this.options.auth.key || !this.options.auth.secret) {
				throw new Error('You need to pass an API key and secret to make authenticated calls.');
			}

			try {
				if (data && this.options.useServerTime) {
					timestamp = await this.time();
				} else {
					timestamp.serverTime = Date.now();
				}

				signature = crypto.createHmac('sha256', this.options.auth.secret)
					.update(BotHttp.makeQueryString({
					...data,
					timestamp
				}).substr(1)).digest('hex');
				newData = callOptions.noExtra ? data : {...data, timestamp, signature};

				result = await this.fetch(fetchPath, newData, callOptions);
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

	public time(): Promise<IServerTime> {
		return new Promise(async (resolve, reject) => {
			try{
				let opts: ICallOpts = <ICallOpts>{};
				let time:number;
				opts.noData = true;
				let server: IServerTime = await this.call('/v1/time', null, opts);
				resolve(server);
			}catch(err){
				reject(`Error in server time sync. Message: ${err}`);
			}
		});
	}

	constructor(options: IBinanceOptions) {
		this.options = options;
	}
}
