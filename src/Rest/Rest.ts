import {BotHttp} from "./BotHttp";
import {EMethod} from "./EMethod";
import {IListenKey} from "./Interfaces/IListenKey";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ICandlesOptions} from "../ExchangeInfo/Interfaces/ICandleOptions";
import {CandleInterval} from "../ExchangeInfo/CandleInterval";
import {Candle} from "../ExchangeInfo/Candle";
import {Market} from "../Market/Market";
import {Binance} from "../Binance/Binance";
import {Bot} from "../Bot";
import {NewOrder} from "../Transaction/NewOrder";
import {ENewOrderRespType, EOrderSide, EOrderType, ETimeInForce} from "../Transaction/Interfaces/EOrderEnums";
import {IOrder} from "../Transaction/Interfaces/IOrder";
import {Order} from "../Transaction/Order";
import {HttpError} from "../Error/HttpError";
import {CancelOrder} from "../Transaction/CancelOrder";
import {Signed} from "./Signed";
import {DataStream} from "./DataStream";
import {CallOptions} from "./CallOptions";
import {ICancelOrderResponse} from "../Transaction/Interfaces/ICancelOrderResponse";
import {IQueryCancelOrder} from "../Transaction/Interfaces/IQueryCancelOrder";
import {OpenOrder} from "../Transaction/OpenOrder";
import {QueryOrder} from "../Transaction/QueryOrder";
import {IOpenOrder} from "../Transaction/Interfaces/IOpenOrder";
import {IQueryOrderResponse} from "../Transaction/Interfaces/IQueryOrderResponse";
import {AllOrders} from "../Transaction/AllOrders";
import {OutboundAccountInfo} from "../Account/OutboundAccountInfo";
import {Balance} from "../Balances/Balance";
import {AccountInfoOptions} from "../Account/AccountInfoOptions";
import {IOutboundAccountInfoRest} from "../Account/Interfaces/IOutboundAccountInfoRest";
import {INewOrder} from "../Transaction/Interfaces/INewOrder";
import {CancelOrderResponse} from "../Transaction/CancelOrderResponse";
import {TestOrder} from "../Transaction/TestOrder";
import {IExchangeInfo} from "../ExchangeInfo/Interfaces/IExchangeInfo";
import {ISymbol} from "../ExchangeInfo/Interfaces/ISymbol";

export class Rest extends BotHttp {
	public static listenKey: IListenKey;

	private _cancelOrder(cancelOrder: CancelOrder): Promise<CancelOrderResponse> {
		return new Promise(async (resolve, reject) => {
			try {
				let orderResRaw: ICancelOrderResponse;
				let response: CancelOrderResponse;
				let privateOrder: IQueryCancelOrder | HttpError | {};
				let url: string = (Binance.options.test) ? "/v3/order/test" : "/v3/order";
				let callOpts: CallOptions = new CallOptions(EMethod.DELETE, true, false, false);
				privateOrder = await this.privateCall(url, callOpts, cancelOrder);
				if (privateOrder instanceof HttpError) {
					reject(privateOrder);
				} else {
					orderResRaw = <ICancelOrderResponse>privateOrder;
					response = new CancelOrderResponse(orderResRaw);
					resolve(response);
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

	private _newOrder(order: NewOrder): Promise<Order | HttpError | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let orderRes: Order;
				let privateOrder: INewOrder | HttpError | TestOrder;
				let url: string = (Binance.options.test) ? "/v3/order/test" : "/v3/order";
				let callOpts: CallOptions = new CallOptions(EMethod.POST, true, false, false);
				privateOrder = await this.privateCall(url, callOpts, NewOrder.toBinance(order));
				if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
					resolve(new TestOrder());
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

	public cancelOrder(symbol: string, orderId: number): Promise<CancelOrderResponse> {
		return new Promise(async (resolve, reject) => {
			try {
				let result: CancelOrderResponse;
				let cancelOrder: CancelOrder = new CancelOrder(symbol, orderId);
				let cancelResult: ICancelOrderResponse = await this._cancelOrder(cancelOrder);
				result = new CancelOrderResponse(<ICancelOrderResponse>cancelResult);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	public cancelOrdersBySymbol(symbol: string): Promise<CancelOrderResponse[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let results: CancelOrderResponse[] = [];
				let openOrders: OpenOrder[] = await this.getOpenOrders(symbol);
				let symbolOrders: OpenOrder[] = openOrders.filter(order => order.symbol === symbol);

				for (let order of symbolOrders) {
					let cancelResp: CancelOrderResponse = await this.cancelOrder(order.symbol, order.orderId);
					results.push(cancelResp);
				}
				resolve(results);
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

	public getAccountInfo(recvWindow?: number): Promise<OutboundAccountInfo> {
		return new Promise(async (resolve, reject) => {
			try {
				let url: string = "/v3/account";
				let opts: AccountInfoOptions = new AccountInfoOptions(recvWindow);
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let accountInfoRest: IOutboundAccountInfoRest = await this.privateCall(url, callOpts, opts);
				let info: OutboundAccountInfo = OutboundAccountInfo.fromBinanceRest(accountInfoRest);
				resolve(info);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getAllOrders(symbol: string, limit: number = 500, orderId?: number, recvWindow?: number): Promise<Order[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let query: AllOrders = new AllOrders(symbol, orderId, limit, recvWindow);
				let url: string = '/v3/allOrders';
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let privateCall: IQueryOrderResponse[] = await this.privateCall(url, callOpts, query);
				let results: Order[] = [];

				if (Array.isArray(privateCall) && privateCall.length > 0) {
					results = privateCall.map(pCall => {
						return new Order(pCall.symbol, pCall.price, pCall.side, pCall.executedQty, pCall.orderId, pCall.origQty, pCall.status, pCall.timeInForce, pCall.type, pCall.clientOrderId, pCall.time);
					});
				}
				resolve(results);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getBalances(recvWindow?: number, gtZeroOnly: boolean = false): Promise<Balance[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let balances: Balance[];
				let accountInfo: OutboundAccountInfo = await this.getAccountInfo(recvWindow);
				balances = accountInfo.balances;

				if (gtZeroOnly) {
					balances = accountInfo.balances.filter(bal => bal.available > 0);
				} else {
					balances = accountInfo.balances;
				}
				resolve(balances);
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

	public getOpenOrders(symbol: string, orderId?: number, recvWindow?: number, origClientOrderId?: string): Promise<OpenOrder[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let url: string = "/v3/openOrders";
				let nOpen: QueryOrder = new QueryOrder(symbol, orderId, recvWindow, origClientOrderId);
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let privateCall: IOpenOrder[] = await this.privateCall(url, callOpts, nOpen);
				let openOrders: OpenOrder[] = [];
				if (Array.isArray(privateCall) && privateCall.length > 0) {
					openOrders = privateCall.map(o => {
						return new OpenOrder(o.clientOrderId, o.executedQty, o.orderId, o.origQty, o.price, o.side, o.status, o.symbol, o.timeInForce, o.type, o.icebergQty, o.isWorking, o.stopPrice, o.time);
					});
				}
				resolve(openOrders);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getOrder(symbol: string, orderId: number, recvWindow?: number, origClientOrderId?: string): Promise<Order> {
		return new Promise(async (resolve, reject) => {
			try {
				let query: QueryOrder = new QueryOrder(symbol, orderId, recvWindow, origClientOrderId);
				let url: string = '/v3/order';
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let privateCall: IQueryOrderResponse = await this.privateCall(url, callOpts, query);
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

	public keepDataStream(): Promise<{}> {
		return new Promise(async (resolve, reject) => {
			let result: object;
			try {
				let callOpts: CallOptions = new CallOptions(EMethod.PUT, true, false, true);
				let dStream: DataStream = new DataStream(Rest.listenKey);
				result = await this.privateCall('/v1/userDataStream', callOpts, dStream);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	public limitBuy(symbol: string, quantity: number, price: number, recvWindow?: number, iceburgQty?: number, timeInForce?: ETimeInForce, stopPrice?: number, newClientOrderId?: string, newOrderRespType?: ENewOrderRespType): Promise<Order | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.LIMIT;
				let side: EOrderSide = EOrderSide.BUY;
				let order: NewOrder = new NewOrder(symbol, quantity, side, type, price, iceburgQty, timeInForce, stopPrice, recvWindow, newClientOrderId, newOrderRespType);
				let orderRes: Order | TestOrder = await this._newOrder(order);
				resolve(orderRes);
			} catch (err) {
				reject(err);
			}
		});
	}

	public limitSell(symbol: string, quantity: number, price: number, recvWindow?: number, iceburgQty?: number, timeInForce?: ETimeInForce, stopPrice?: number, newClientOrderId?: string, newOrderRespType?: ENewOrderRespType): Promise<Order | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.LIMIT;
				let side: EOrderSide = EOrderSide.SELL;
				let order: NewOrder = new NewOrder(symbol, quantity, side, type, price, iceburgQty, timeInForce, stopPrice, recvWindow, newClientOrderId, newOrderRespType);
				let orderRes: Order | {} = await this._newOrder(order);
				resolve(orderRes);
			} catch (err) {
				reject(err)
			}
		});
	}

	public marketBuy(symbol: string, quantity: number, recvWindow?: number): Promise<Order | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.MARKET;
				let side: EOrderSide = EOrderSide.BUY;
				let order: NewOrder = new NewOrder(symbol, quantity, side, type, null, null, null, null, recvWindow, null, null);
				let orderRes: Order | {} = await this._newOrder(order);
				resolve(orderRes)
			} catch (err) {
				reject(err);
			}
		});
	}

	public marketSell(symbol: string, quantity: number, recvWindow?: number): Promise<Order | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let type: EOrderType = EOrderType.MARKET;
				let side: EOrderSide = EOrderSide.SELL;
				let order: NewOrder = new NewOrder(symbol, quantity, side, type, null, null, null, null, recvWindow, null, null);
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