import {BBRest} from "./BBRest";
import {ICallOpts} from "./Interfaces/ICallOpts";
import {EMethod} from "./EMethod";
import {IListenKey} from "./IListenKey";
import {iBinanceOptions} from "../Binance/Interfaces/iBinanceOptions";
import {IOutboundAccountInfoRaw} from "../Account/Interfaces/IOutboundAccountInfoRaw";
import {OutboundAccountInfo} from "../Account/OutboundAccountInfo";

export class BinanceRest extends BBRest {
	public listenKey: IListenKey;
	public user:any;
	public userEventHandler:Function;

	public closeDataStream():Promise<object>{
		return new Promise(async (resolve, reject) => {
			let result: object;
			try{
				let callOpts: ICallOpts = <ICallOpts>{};
				callOpts.method = EMethod.DELETE;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = await this._call('/v1/userDataStream', this.listenKey, callOpts);
				resolve(result);
			}catch(err){
				reject(err);
			}
		});
	}

	public getDataStream(): Promise<IListenKey> {
		return new Promise(async (resolve, reject) => {
			try{
				let callOpts: ICallOpts = <ICallOpts>{};
				callOpts.method = EMethod.POST;
				callOpts.noData = true;
				this.listenKey = <IListenKey> await this._call('/v1/userDataStream', null, callOpts);
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
				let callOpts: ICallOpts = <ICallOpts>{};
				callOpts.method = EMethod.PUT;
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
			let infoRaw: IOutboundAccountInfoRaw = json;
			const { e: type, ...rest } = json;
			let accountInfo:OutboundAccountInfo = new OutboundAccountInfo(infoRaw);
			cb(accountInfo[type] ? accountInfo[type](rest) : { type, ...rest })
		};

	}
}