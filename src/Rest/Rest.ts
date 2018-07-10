import {BotHttp} from "./BotHttp";
import {ICallOpts} from "./Interfaces/ICallOpts";
import {EMethod} from "./EMethod";
import {IListenKey} from "./IListenKey";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {iCandlesOptions} from "../ExchangeInfo/Interfaces/ICandleOptions";
import {CandleInterval} from "../ExchangeInfo/CandleInterval";
import {Candle} from "../ExchangeInfo/Candle";
import {IExchangeInfo} from "./Interfaces/IExchangeInfo";
import {Market} from "../Market/Market";
import {ISymbol} from "ExchangeInfo/Interfaces/ISymbol";
import {Binance} from "../Binance/Binance";
import {Bot} from "../Index";
import {Order} from "../Transaction/Order";
import {NewOrder} from "../Transaction/NewOrder";

export class Rest extends BotHttp {
	public static listenKey: IListenKey;

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

	public closeDataStream(): Promise<{}> {
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

	public newOrder(order: NewOrder, options: ICallOpts): Promise<Order> {
		return new Promise(async (resolve, reject) => {
			try {
				let url: string = (Binance.options.test) ? "/v3/order/test" : "/v3/order";
				await this.privateCall(url, order, options);
			} catch (err) {
				reject(err);
			}
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
					callOpts.noExtra = false;
					Rest.listenKey = <IListenKey> await this.privateCall('/v1/userDataStream', null, callOpts);
					resolve(Rest.listenKey);
				}catch(err){
					reject(err);
				}
			});
	}

	public getMarkets(quoteAsset?: string): Promise<Market[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let info: IExchangeInfo = await this.getExchangeInfo();
				let symbols: ISymbol[] = info.symbols;
				let markets: Market[] = symbols.map(symbol => {
					return new Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market.GetLimitsFromBinanceSymbol(symbol));
				});
				Binance.markets = markets;
				resolve(markets);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getExchangeInfo(): Promise<IExchangeInfo>{
		return new Promise(async (resolve, reject)=>{
			try{
				let opts: ICallOpts = <ICallOpts>{};
				opts.noData = true;
				opts.headers = new Headers();
				opts.method = EMethod.GET;
				opts.json = true;
				let info: IExchangeInfo = await this.call('/v1/exchangeInfo', null, opts);
				resolve(info);
			}catch(err){
				reject(err);
			}
		});
	};

	public keepDataStream(): Promise<{}> {
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
	}
}