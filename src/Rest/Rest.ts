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
import {ENewOrderRespType, EOrderSide, EOrderType, ETimeInForce} from "../Transaction/Interfaces/EOrderEnums";
import {IOrder} from "../Transaction/Interfaces/IOrder";
import {Order} from "../Transaction/Order";
import {HttpError} from "../Error/HttpError";
import {QueryCancelOrder} from "../Transaction/QueryCancelOrder";
import {Signed} from "./Signed";
import {DataStream} from "./DataStream";
import {CallOptions} from "./CallOptions";
import {ICancelOrderResult} from "../Transaction/Interfaces/ICancelOrderResult";
import {IQueryCancelOrder} from "../Transaction/Interfaces/IQueryCancelOrder";
import {OpenOrder} from "../Transaction/OpenOrder";
import {QueryOrder} from "../Transaction/QueryOrder";
import {IOpenOrder} from "../Transaction/Interfaces/IOpenOrder";
import {IQueryOrderResult} from "../Transaction/Interfaces/IQueryOrderResult";

export class Rest extends BotHttp {
	public static listenKey: IListenKey;

	private _cancelOrder(cancelOrder: QueryCancelOrder): Promise<ICancelOrderResult | {}> {
		return new Promise(async (resolve, reject) => {
			try {
				let orderRes: ICancelOrderResult;
				let privateOrder: IQueryCancelOrder | HttpError | {};
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
						let order: IOrder = <IOrder>privateOrder;
						orderRes = new Order(order.symbol, order.price, order.side, order.executedQty,
							order.orderId, order.origQty, order.status, order.timeInForce, order.type,
							order.clientOrderId, order.transactTime);
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
				let cancelOrder: QueryCancelOrder = new QueryCancelOrder(symbol, orderId);
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
				let cancelOrder: QueryCancelOrder = new QueryCancelOrder(symbol);
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
				let nOpen: QueryOrder = new QueryOrder(symbol, orderId, recvWindow, origClientOrderId);
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let iOpenOrders: IOpenOrder[] = await this.privateCall(url, callOpts, nOpen);
				let openOrders: OpenOrder[] = iOpenOrders.map(o => {
					return new OpenOrder(o.clientOrderId, o.executedQty, o.orderId, o.origQty, o.price, o.side, o.status, o.symbol, o.timeInForce, o.type, o.icebergQty, o.isWorking, o.stopPrice, o.time);
				});
				resolve(openOrders);
				resolve();
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

	public getOrder(symbol: string, orderId: number, recvWindow?: number, origClientOrderId?: string): Promise<Order> {
		return new Promise(async (resolve, reject) => {
			try {
				let query: QueryOrder = new QueryOrder(symbol, orderId, recvWindow, origClientOrderId);
				let url: string = '/v3/order';
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let privateCall: IQueryOrderResult = await this.privateCall(url, callOpts, query);
				let result: Order;
				if (privateCall && privateCall.hasOwnProperty("symbol")) {
					result = new Order(privateCall.symbol, privateCall.price, privateCall.side, privateCall.executedQty, privateCall.orderId, privateCall.origQty, privateCall.status, privateCall.timeInForce, privateCall.type, privateCall.clientOrderId, privateCall.time);
				}
				resolve(result);
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

	public limitBuy(symbol: string, quantity: number, price: number, recvWindow?: number, iceburgQty?: number, timeInForce?: ETimeInForce, stopPrice?: number, newClientOrderId?: string, newOrderRespType?: ENewOrderRespType) {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.LIMIT;
				let side: EOrderSide = EOrderSide.BUY;
				let order: NewOrder = new NewOrder(symbol, quantity, EOrderSide[side], EOrderType[type], price.toString(), iceburgQty.toString(), ETimeInForce[timeInForce], stopPrice.toString(), recvWindow, newClientOrderId, ENewOrderRespType[newOrderRespType]);
				let orderRes: Order | {} = await this._newOrder(order);
				resolve(orderRes)
			} catch (err) {
				reject(err);
			}
		});
	}

	public limitSell(symbol: string, quantity: number, price: number, recvWindow?: number, iceburgQty?: number, timeInForce?: ETimeInForce, stopPrice?: number, newClientOrderId?: string, newOrderRespType?: ENewOrderRespType) {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.LIMIT;
				let side: EOrderSide = EOrderSide.SELL;
				let order: NewOrder = new NewOrder(symbol, quantity, EOrderSide[side], EOrderType[type], price.toString(), iceburgQty.toString(), ETimeInForce[timeInForce], stopPrice.toString(), recvWindow, newClientOrderId, ENewOrderRespType[newOrderRespType]);
				let orderRes: Order | {} = await this._newOrder(order);
				resolve(orderRes);
			} catch (err) {
				reject(err)
			}
		});
	}

	public marketBuy(symbol: string, quantity: number, recvWindow?: number): Promise<Order | {}> {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.MARKET;
				let side: EOrderSide = EOrderSide.BUY;
				let order: NewOrder = new NewOrder(symbol, quantity, EOrderSide[side], EOrderType[type], null, null, null, null, recvWindow, null, null);
				let orderRes: Order | {} = await this._newOrder(order);
				resolve(orderRes)
			} catch (err) {
				reject(err);
			}
		});
	}

	public marketSell(symbol: string, quantity: number, recvWindow?: number): Promise<NewOrder | {}> {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.MARKET;
				let side: EOrderSide = EOrderSide.SELL;
				let order: NewOrder = new NewOrder(symbol, quantity, EOrderSide[side], EOrderType[type], null, null, null, null, recvWindow, null, null);
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