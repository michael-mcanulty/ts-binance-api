import * as fetch from 'isomorphic-fetch'
import * as crypto from 'crypto'
import {HttpError} from "../Error/HttpError";
import {Auth} from "../Account/Auth";
import {ServerTime} from "./Interfaces/ServerTime";
import {eMethod} from "./eMethod";
import {iCallOpts} from "./Interfaces/iCallOpts";
import {iBinanceOptions} from "../Binance/Interfaces/iBinanceOptions";

export class BbRest{
	public static BASE: string = 'https://app.binance.com';
	public auth: Auth;
	public options:iBinanceOptions;

	public _call(path:string, data: any, callOptions: iCallOpts):Promise<any> {
		return new Promise(async (resolve, reject) => {
			let result: any;
			let signature:string;
			let timestamp: ServerTime;
			let newData: any;
			let headersInit:HeadersInit = [['X-MBX-APIKEY', this.auth.key]];
			let headers:Headers = new Headers(headersInit);
			if(!callOptions){
				callOptions = <iCallOpts>{};
				callOptions.noData = false;
			}

			let fetchPath:string = this.buildUrl(path, data, callOptions.noData);
			callOptions.headers = headers;
			callOptions.method = eMethod.GET;
			callOptions.json = true;

			if (!this.auth.key || !this.auth.secret) {
				throw new Error('You need to pass an API key and secret to make authenticated calls.');
			}

			try {
				if (data && this.options.useServerTime) {
					timestamp = await this.call('/v1/time');
				} else {
					timestamp.serverTime = Date.now();
				}

				signature = crypto.createHmac('sha256', this.auth.secret).update(this.makeQueryString({
					...data,
					timestamp
				}).substr(1)).digest('hex');
				newData = callOptions.noExtra ? data : {...data, timestamp, signature};

				result = await this.fetch(fetchPath, newData, callOptions);
				resolve(result);
			}catch(err){
				reject(err);
			}
		});
	}

	private buildUrl(path:string, data:object, noData:boolean):string{
		return `${BbRest.BASE}${path.includes('/wapi') ? '' : '/app'}${path}${noData ? '' : this.makeQueryString(data)}`;
	}

	call(path:string, data?: any, callOptions?: iCallOpts):Promise<any>{
		return new Promise(async (resolve, reject) => {
			let result:any;
			if(!callOptions){
				callOptions = <iCallOpts>{};
				callOptions.noData = false;
			}
		  try{
				result = await this.fetch(path, data, callOptions);
				resolve(result);
			}catch(err){
		  	reject(err);
			}
		});
	}

	private checkParams(name: string, payload: object, requires: any[]): boolean {
		if (!payload) {
			throw new Error('You need to pass a payload object.')
		}

		requires.forEach(r => {
			if (!payload[r] && isNaN(payload[r])) {
				throw new Error(`Method ${name} requires ${r} parameter.`)
			}
		});

		return true
	}

	public fetch(path:string, payload:any, callOptions: iCallOpts):Promise<any>{
		return new Promise(async (resolve, reject)=>{
			let json:any;
			let msg:string;
			let err:HttpError;
			if(typeof callOptions.noData !== "boolean"){
				callOptions.noData = false;
			}

			let params:string = this.buildUrl(path, payload, callOptions.noData);
			let reqOpts: RequestInit = <RequestInit>{};
			reqOpts.method = eMethod[eMethod.GET];
			reqOpts.headers = new Headers();
			try{
				let res:Response = await fetch(params, reqOpts);
				json = await res.json();
				if (!res.ok) {
					err = new HttpError(res.statusText, json.code);
					reject(err);
				}else{
					resolve(json);
				}
			}catch(err){
				reject(err);
			}
		})
	}

	private makeQueryString(params:any):string{
		let result:string;
		if(!params){
			result = "";
		}else{
			const esc = encodeURIComponent;
			result = Object.keys(params).map(k => `?${esc(k)}=${esc(params[k])}`).join('&');
		}
		return result;
	}

	ping():Promise<boolean>{
		return new Promise(async (resolve, reject) => {
			try{
				let opts:iCallOpts = <iCallOpts>{};
				opts.noData = true;
				let res: object = await this.call('/v1/ping', null, opts);
				let ping:boolean = (Object.keys(res).length === 0);
				if(ping){
					resolve(ping);
				}
			}catch(err){
				reject(err);
			}
		});
	}

	time():Promise<number>{
		return new Promise(async (resolve, reject) => {
			try{
				let opts:iCallOpts = <iCallOpts>{};
				let time:number;
				opts.noData = true;
				let server:ServerTime = await this.call('/v1/time', null, opts);
				time = server.serverTime;
				resolve(time);
			}catch(err){
				reject(`Error in server time sync. Message: ${err}`);
			}
		});
	}

	constructor(options:iBinanceOptions){
		this.options = options;
	}
}
