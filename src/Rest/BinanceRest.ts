import {BbRest} from "./BbRest";
import {iCallOpts} from "./Interfaces/iCallOpts";
import {eMethod} from "./eMethod";
import {iListenKey} from "./iListenKey";
import {iBinanceOptions} from "../Binance/Interfaces/iBinanceOptions";
import {iOutboundAccountInfoRaw} from "../Account/Interfaces/iOutboundAccountInfoRaw";
import {OutboundAccountInfo} from "../Account/OutboundAccountInfo";

export class BinanceRest extends BbRest{
	public listenKey:iListenKey;
	public user:any;
	public userEventHandler:Function;

	public closeDataStream():Promise<object>{
		return new Promise(async (resolve, reject) => {
			let result: object;
			try{
				let callOpts: iCallOpts = <iCallOpts>{};
				callOpts.method = eMethod.DELETE;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = await this._call('/v1/userDataStream', this.listenKey, callOpts);
				resolve(result);
			}catch(err){
				reject(err);
			}
		});
	}

	public getDataStream():Promise<iListenKey>{
		return new Promise(async (resolve, reject) => {
			try{
				let callOpts: iCallOpts = <iCallOpts>{};
				callOpts.method = eMethod.POST;
				callOpts.noData = true;
				this.listenKey= <iListenKey> await this._call('/v1/userDataStream', null, callOpts);
				resolve(this.listenKey);
			}catch(err){
				reject(err);
			}
		});
	}

	public keepDataStream():Promise<object>{
		return new Promise(async (resolve, reject) => {
			let result: object;
			try{
				let callOpts: iCallOpts = <iCallOpts>{};
				callOpts.method = eMethod.PUT;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = await this._call('/v1/userDataStream', this.listenKey, callOpts);
				resolve(result);
			}catch(err){
				reject(err);
			}
		});
	}

	constructor(options:iBinanceOptions){
		super(options);
		this.userEventHandler = cb => msg => {
			let json = JSON.parse(msg.data);
			let infoRaw:iOutboundAccountInfoRaw = json;
			const { e: type, ...rest } = json;
			let accountInfo:OutboundAccountInfo = new OutboundAccountInfo(infoRaw);
			cb(accountInfo[type] ? accountInfo[type](rest) : { type, ...rest })
		};

	}
}