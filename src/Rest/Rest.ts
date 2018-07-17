import {BotHttp} from "./BotHttp";
import {EMethod} from "./EMethod";
import {IListenKey} from "./IListenKey";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ICandlesOptions} from "../ExchangeInfo/Interfaces/ICandleOptions";
import {CandleInterval} from "../ExchangeInfo/CandleInterval";
import {Candle} from "../ExchangeInfo/Candle";
import {IExchangeInfo} from "./Interfaces/IExchangeInfo";
import {Market} from "../Market/Market";
import {ISymbol} from "ExchangeInfo/Interfaces/ISymbol";
import {Binance} from "../Binance/Binance";
import {Bot} from "../Index";
import {NewOrder} from "../Transaction/NewOrder";
import {EOrderSide, EOrderType} from "../Transaction/Interfaces/EOrderEnums";
import {IOrder} from "../Transaction/Interfaces/IOrder";
import {Order} from "../Transaction/Order";
import {HttpError} from "../Error/HttpError";
import {NewCancelOrder} from "../Transaction/NewCancelOrder";
import {Signed} from "./Signed";
import {DataStream} from "./DataStream";
import {CallOptions} from "./CallOptions";
import {ICancelOrderResult} from "../Transaction/Interfaces/ICancelOrderResult";
import {INewCancelOrder} from "../Transaction/Interfaces/INewCancelOrder";
import {OpenOrder} from "../Transaction/OpenOrder";
import {NewOpenOrder} from "../Transaction/NewOpenOrder";
import {IOpenOrder} from "../Transaction/Interfaces/IOpenOrder";

export class Rest extends BotHttp {
	public static listenKey: IListenKey;

	private _cancelOrder(cancelOrder: NewCancelOrder): Promise<ICancelOrderResult | {}> {
		return new Promise(async (resolve, reject) => {
			try {
				let orderRes: ICancelOrderResult;
				let privateOrder: INewCancelOrder | HttpError | {};
				let url: string = (Binance.options.test) ? "/v3/order/test" : "/v3/order";
				let callOpts: CallOptions = new CallOptions(EMethod.DELETE, true, false, false);
				privateOrder = await this.privateCall(url, callOpts, cancelOrder);
				if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
					resolve(<{}>privateOrder);
				} else {
					if (privateOrder instanceof HttpError) {
						reject(privateOrder);
					} else {
						orderRes = <ICancelOrderResult>privateOrder;
						resolve(orderRes);
					}
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	private _getCandlesInterval(symbol: string, interval: string, limit?: number): Promise<Candle[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let candleOpts: ICandlesOptions = <ICandlesOptions>{};
				candleOpts.symbol = symbol;
				candleOpts.interval = interval;
				candleOpts.limit = limit;

				let callOpts: CallOptions = new CallOptions(EMethod.GET);
				let raw: any[][] = await this.call('/v1/klines', callOpts, candleOpts);
				let candles: Candle[] = Candle.fromHttpByInterval(raw, candleOpts.symbol, candleOpts.interval);
				candles.forEach((candle) => {
					candle.quoteAsset = Bot.binance.rest.getQuoteAssetName(symbol);
				});
				resolve(candles);
			} catch (err) {
				reject(err);
			}
		});
	};

	private _newOrder(order: NewOrder): Promise<Order | HttpError | {}> {
		return new Promise(async (resolve, reject) => {
			try {
				let orderRes: Order;
				let privateOrder: IOrder | {} | HttpError;
				let url: string = (Binance.options.test) ? "/v3/order/test" : "/v3/order";
				let callOpts: CallOptions = new CallOptions(EMethod.POST, true, false, false);
				privateOrder = await this.privateCall(url, callOpts, order);
				if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
					resolve(<{}>privateOrder);
				} else {
					if (privateOrder instanceof HttpError) {
						reject(privateOrder);
					} else {
						orderRes = new Order(<IOrder>privateOrder);
						resolve(orderRes);
					}
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	public cancelOrder(symbol: string, orderId: number): Promise<ICancelOrderResult | {}> {
		return new Promise(async (resolve, reject) => {
			try {
				let cancelOrder: NewCancelOrder = new NewCancelOrder(symbol, orderId);
				if (cancelOrder && cancelOrder.hasOwnProperty("symbol")) {
					OpenOrder.cancelOrderById(orderId);
				}
				let cancelResult: ICancelOrderResult | {} = this._cancelOrder(cancelOrder);
				resolve(cancelResult);
			} catch (err) {
				reject(err);
			}
		});
	}

	public cancelOrdersBySymbol(symbol: string) {
		return new Promise(async (resolve, reject) => {
			try {
				let cancelOrder: NewCancelOrder = new NewCancelOrder(symbol);
				if (cancelOrder && cancelOrder.hasOwnProperty("symbol")) {
					OpenOrder.cancelOrdersBySymbol(symbol);
				}
				let cancelResult: ICancelOrderResult[] | {} = this._cancelOrder(cancelOrder);
				resolve(cancelResult);
			} catch (err) {
				reject(err);
			}
		});
	}

	public closeDataStream(): Promise<{}> {
		return new Promise(async (resolve, reject) => {
			let result: object;
			try {
				let callOpts: CallOptions = new CallOptions(EMethod.DELETE, true, false, true);
				let dStream: DataStream = new DataStream(Rest.listenKey);
				result = await this.privateCall('/v1/userDataStream', callOpts, dStream);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getCandles(symbols: string[], intervals: string[], limit?: number): Promise<CandleInterval[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let candleIntervals: CandleInterval[] = [];
				for (let symbol of symbols) {
					for (let interval of intervals) {
						let candles: Candle[] = await this._getCandlesInterval(symbol, interval, limit);
						let ci = new CandleInterval(candles);
						candleIntervals.push(ci);
					}
				}
				resolve(candleIntervals);
			} catch (err) {
				reject(err);
			}
		});
	};

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

	public getDataStream(): Promise<IListenKey> {
		return new Promise(async (resolve, reject) => {
			try {
				let callOpts: CallOptions = new CallOptions(EMethod.POST, true, true, false);
				let signed = new Signed();
				Rest.listenKey = <IListenKey> await this.privateCall('/v1/userDataStream', callOpts, signed);
				resolve(Rest.listenKey);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getExchangeInfo(): Promise<IExchangeInfo> {
		return new Promise(async (resolve, reject) => {
			try {
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, true, false, this.options.auth.key);
				let info: IExchangeInfo = await this.call('/v1/exchangeInfo', callOpts);
				resolve(info);
			} catch (err) {
				reject(err);
			}
		});
	};

	public getOpenOrders(symbol: string, orderId: number, recvWindow?: number, origClientOrderId?: string): Promise<OpenOrder[]> {
		return new Promise(async (resolve, reject) => {
			try {

				let url: string = "/v3/openOrders";
				let nOpen: NewOpenOrder = new NewOpenOrder(symbol, orderId, recvWindow, origClientOrderId);
				let privateOpenOrder: IOpenOrder = await this.privateCall(url, callOpts, nOpen);
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

	public getOrder(symbol: string, orderId: number, recvWindow?: number, origClientOrderId?: string): Promise<OpenOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let nOpen: NewOpenOrder = new NewOpenOrder(symbol, orderId, recvWindow, origClientOrderId);

			} catch (err) {
				reject(err);
			}
		});
	}

	public keepDataStream(): Promise<{}> {
		return new Promise(async (resolve, reject) => {
			let result: object;
			try {
				let callOpts: CallOptions = new CallOptions(EMethod.PUT, true, false, true)
				let dStream: DataStream = new DataStream(Rest.listenKey);
				result = await this.privateCall('/v1/userDataStream', callOpts, dStream);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	public limitBuy(symbol: string, price: number, quantity: number) {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.LIMIT;
				let side: EOrderSide = EOrderSide.BUY;
				let order: NewOrder = new NewOrder(quantity, side, symbol, type, price);
				let orderRes: Order | {} = await this._newOrder(order);
				resolve(orderRes)
			} catch (err) {
				reject(err);
			}
		});
	}

	public limitSell(symbol: string, price: number, quantity?: number) {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.LIMIT;
				let side: EOrderSide = EOrderSide.SELL;
				let newOrder: NewOrder | {} = new NewOrder(quantity, side, symbol, type, price);
				resolve(newOrder);
			} catch (err) {
				reject(err)
			}
		});
	}

	public marketBuy(symbol: string, quantity: number): Promise<Order | {}> {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.MARKET;
				let side: EOrderSide = EOrderSide.BUY;
				let order: NewOrder = new NewOrder(quantity, side, symbol, type);
				let orderRes: Order | {} = await this._newOrder(order);
				resolve(orderRes)
			} catch (err) {
				reject(err);
			}
		});
	}

	public marketSell(symbol: string, quantity: number): Promise<NewOrder | {}> {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.MARKET;
				let side: EOrderSide = EOrderSide.SELL;
				let order: NewOrder = new NewOrder(quantity, side, symbol, type);
				let orderRes: Order | {} = await this._newOrder(order);
				resolve(orderRes);
			} catch (err) {
				reject(err)
			}
		});
	}

	constructor(options: IBinanceOptions) {
		super(options);
	}
}