import {BotHttp} from "./BotHttp";
import {ICallOpts} from "./Interfaces/ICallOpts";
import {EMethod} from "./EMethod";
import {IListenKey} from "./IListenKey";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {IOutboundAccountInfoRaw} from "../Account/Interfaces/IOutboundAccountInfoRaw";
import {OutboundAccountInfo} from "../Account/OutboundAccountInfo";
import {iCandlesOptions} from "../ExchangeInfo/Interfaces/ICandleOptions";
import {CandleInterval} from "../ExchangeInfo/CandleInterval";
import {Candle} from "../ExchangeInfo/Candle";
import {IExchangeInfo} from "./Interfaces/IExchangeInfo";
import {Market} from "../Market/Market";
import {ISymbol} from "ExchangeInfo/Interfaces/ISymbol";
import {Binance} from "../Binance/Binance";
import {Bot} from "../Index";

export class Rest extends BotHttp {
	public static listenKey: IListenKey;
	public user:any;
	public userEventHandler:Function;

	private _getCandlesInterval(symbol: string, interval:string, limit?: number): Promise<Candle[]>{
		return new Promise(async (resolve, reject)=>{
			try{
				let candleOpts:iCandlesOptions = <iCandlesOptions>{};
				candleOpts.symbol = symbol;
				candleOpts.interval = interval;
				candleOpts.limit = limit;
				let raw: any[][] = await this.call('/v1/klines', candleOpts);
				let candles:Candle[] = Candle.fromHttpByInterval(raw, candleOpts.symbol, candleOpts.interval);
				candles.forEach((candle) => {
					candle.quoteAsset = Bot.binance.rest.getQuoteAssetName(symbol);
				});
				resolve(candles);
			}catch(err){
				reject(err);
			}
		});
	};

	public closeDataStream():Promise<object>{
		return new Promise(async (resolve, reject) => {
			let result: object;
			try{
				let callOpts: ICallOpts = <ICallOpts>{};
				callOpts.method = EMethod.DELETE;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = await this.privateCall('/v1/userDataStream', Rest.listenKey, callOpts);
				resolve(result);
			}catch(err){
				reject(err);
			}
		});
	}

	public getCandles(symbols: string[], intervals:string[], limit?:number): Promise<CandleInterval[]>{
		return new Promise(async (resolve, reject)=>{
			try{
				let candleIntervals:CandleInterval[]=[];
				for(let symbol of symbols){
					for(let interval of intervals){
						let candles:Candle[] = await this._getCandlesInterval(symbol, interval, limit);
						let ci = new CandleInterval(candles);
						candleIntervals.push(ci);
					}
				}
				resolve(candleIntervals);
			}catch(err){
				reject(err);
			}
		});
	};

	public getMarkets(quoteAsset?: string): Promise<Market[]> {
		return new Promise(async (resolve, reject) => {
			let info: IExchangeInfo = await this.getExchangeInfo();
			let symbols: ISymbol[] = info.symbols;
			let markets: Market[] = symbols.map(symbol => {
				return new Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market.GetLimitsFromBinanceSymbol(symbol));
			});
			resolve(markets);
		});
	}

	public getQuoteAssetName(symbol: string): string {
		let qa: string;
		let marketFilter: Market[] = Binance.markets.filter(market => market.symbol === symbol);
		let market: Market;
		if (marketFilter && marketFilter.length > 0) {
			market = marketFilter[0];
			qa = market.quoteAsset;
		}
		return qa;
	}

	public getDataStream(): Promise<IListenKey> {
			return new Promise(async (resolve, reject) => {
				try{
					let callOpts: ICallOpts = <ICallOpts>{};
					callOpts.method = EMethod.POST;
					callOpts.noData = true;
					Rest.listenKey = <IListenKey> await this.privateCall('/v1/userDataStream', null, callOpts);
					resolve(Rest.listenKey);
				}catch(err){
					reject(err);
				}
			});
	}

	public getExchangeInfo(): Promise<IExchangeInfo>{
		return new Promise(async (resolve, reject)=>{
			try{
				let opts: ICallOpts = <ICallOpts>{};
				opts.noData = true;
				let info: IExchangeInfo = await this.call('/v1/exchangeInfo', null, opts);
				resolve(info);
			}catch(err){
				reject(err);
			}
		});
	};

	public keepDataStream():Promise<object>{
		return new Promise(async (resolve, reject) => {
			let result: object;
			try{
				let callOpts: ICallOpts = <ICallOpts>{};
				callOpts.method = EMethod.PUT;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = await this.privateCall('/v1/userDataStream', Rest.listenKey, callOpts);
				resolve(result);
			}catch(err){
				reject(err);
			}
		});
	}

	constructor(options: IBinanceOptions) {
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