import {BotHttp} from "./BotHttp";
import {EMethod} from "./EMethod";
import {IListenKey} from "./Interfaces/IListenKey";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ICandlesOptions} from "../ExchangeInfo/Interfaces/ICandleOptions";
import {CandleInterval} from "../ExchangeInfo/CandleInterval";
import {Candle} from "../ExchangeInfo/Candle";
import {Market} from "../Market/Market";
import {Binance} from "../Binance/Binance";
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
import {ICancelOrderOpts, IPrice, ITotalBalance, Price} from "..";
import {IDepositAddressResult} from "../Deposit/Interfaces/IDepositAddressResult";
import {IDepositAddressReq} from "../Deposit/Interfaces/IDepositAddressReq";
import {IDepositHistoryResult} from "../Deposit/Interfaces/IDepositHistoryResult";
import {IDepositHistoryReq} from "../Deposit/Interfaces/IDepositHistoryReq";
import {ISystemStatus} from "../Binance/Interfaces/ISystemStatus";
import {IWithdrawHistoryReq} from "../Withdraw/Interfaces/IWithdrawHistoryReq";
import {IWithdrawHistoryResult} from "../Withdraw/Interfaces/IWithdrawHistoryResult";
import {ILimitOrderOpts} from "../Transaction/Interfaces/ILimitOrderOpts";
import {IGetOrderOpts} from "../Transaction/Interfaces/IGetOrderOpts";
import {IQueryOrderOpts} from "../Transaction/Interfaces/IQueryOrderOpts";
import {IMarketOrderOpts} from "../Transaction/Interfaces/IMarketOrderOpts";

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
					candle.quoteAsset = Rest.getQuoteAssetName(symbol);
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
				let privateOrder: IOrder | HttpError | TestOrder;
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
						orderRes = new Order(order);
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
				let cOpts: ICancelOrderOpts = <ICancelOrderOpts>{};
				cOpts.symbol = symbol;
				cOpts.orderId = orderId;
				let cancelOrder: CancelOrder = new CancelOrder(cOpts);
				let cancelResult: ICancelOrderResponse = await this._cancelOrder(cancelOrder);
				result = new CancelOrderResponse(<ICancelOrderResponse>cancelResult);
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	public cancelOrdersBySymbol(options: IGetOrderOpts): Promise<CancelOrderResponse[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let results: CancelOrderResponse[] = [];
				let config: IGetOrderOpts = <IGetOrderOpts>{};
				config.symbol = options.symbol;
				let openOrders: OpenOrder[] = await this.getOpenOrders(config);
				let symbolOrders: OpenOrder[] = openOrders.filter(order => order.symbol === config.symbol);

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
					results = privateCall.map((qCall:IQueryOrderResponse) => {
						let opts: IOrder = <IOrder>{};
						opts.cummulativeQuoteQty = qCall.cummulativeQuoteQty;
						opts.symbol = qCall.symbol;
						opts.side = qCall.side;
						opts.type = qCall.type;
						opts.price = qCall.price;
						opts.clientOrderId = qCall.clientOrderId;
						opts.orderId = qCall.orderId;
						opts.executedQty = qCall.executedQty;
						opts.origQty = qCall.origQty;
						opts.transactTime = qCall.time;
						opts.status = qCall.status;
						opts.signature = qCall.signature;
						opts.timeInForce = qCall.timeInForce;
						opts.isWorking = qCall.isWorking;
						return new Order(opts);
					});
				}
				resolve(results);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getAvailableTotalBalance(quoteAsset: string, dollarBaseAsset: string = "USDT", primaryBaseAsset: string = "BTC"): Promise<ITotalBalance> {
		return new Promise(async (resolve, reject) => {
			try {
				//get BTC qty first
				let balances: Balance[] = await this.getBalances();
				let prices: Price[] = await this.getPrices();
				if (balances.length === 0) {
					reject("Error: Balances not working");
				}

				const QA = quoteAsset;
				const USDT = dollarBaseAsset;
				const FA = "BNB";
				const BTC = primaryBaseAsset;

				let balVals: ITotalBalance[] = [];
				let result: ITotalBalance = <ITotalBalance>{};

				balances.forEach((bal: Balance) => {
					let avail: ITotalBalance = <ITotalBalance>{};
					let BA: string = bal.asset;
					let available: number = bal.available;

					let symbol: string;

					if (BA !== BTC && BTC !== QA) {
						symbol = BA + BTC;
						let exchangeValue: number = Price.GetPriceValue(prices, symbol);
						avail.quoteAsset = quoteAsset;
						let totalBTCVal: number = available * exchangeValue;
						avail.totalVal = totalBTCVal * Price.GetPriceValue(prices, BTC + USDT);
						balVals.push(avail);
					} else {
						if (BA === BTC && BTC !== QA) {
							symbol = BA + QA;
							avail.quoteAsset = quoteAsset;
							avail.totalVal = available * Price.GetPriceValue(prices, BTC + USDT);
							balVals.push(avail);
						} else if (BTC === QA && BA !== BTC) {
							symbol = BA + QA;
							let exchangeValue: number = Price.GetPriceValue(prices, symbol);
							avail.quoteAsset = quoteAsset;
							avail.totalVal = available * exchangeValue;
							balVals.push(avail);
						} else if (BTC === QA && BA === BTC) {
							symbol = BA + QA;
							avail.quoteAsset = quoteAsset;
							avail.totalVal = available;
							balVals.push(avail);
						}
					}
				});

				result.totalVal = balVals.reduce((prev, cur) => {
					return prev + cur.totalVal;
				}, 0);
				result.quoteAsset = quoteAsset;
				resolve(result);
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

	public getDepositAddress(request: IDepositAddressReq): Promise<IDepositAddressResult> {
		return new Promise(async (resolve, reject) => {
			try {
				let url: string = '/wapi/v3/depositAddress.html';
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let depositAddress: IDepositAddressResult = await this.privateCall(url, callOpts, request);
				resolve(depositAddress);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getDepositHisory(request: IDepositHistoryReq): Promise<IDepositHistoryResult> {
		return new Promise(async (resolve, reject) => {
			try {
				let url: string = '/wapi/v3/depositHistory.html';
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let depositHistory: IDepositHistoryResult = await this.privateCall(url, callOpts, request);
				resolve(depositHistory);
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

	public getOpenOrders(options: IGetOrderOpts): Promise<OpenOrder[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let opts: IQueryOrderOpts = <IQueryOrderOpts>{};
				let url: string = "/v3/openOrders";
				let query: QueryOrder;
				let callOpts: CallOptions;
				let privateCall: IOpenOrder[];
				let openOrders: OpenOrder[];

				opts.symbol = options.symbol;
				opts.recvWindow = options.recvWindow;
				opts.orderId = options.orderId;
				opts.origClientOrderId = options.origClientOrderId;
				query = new QueryOrder(opts);
				callOpts = new CallOptions(EMethod.GET, true, false, false);
				privateCall = await this.privateCall(url, callOpts, query);
				openOrders = [];
				if (Array.isArray(privateCall) && privateCall.length > 0) {
					openOrders = privateCall.map((o: IOpenOrder) => {
						return new OpenOrder(o);
					});
					resolve(openOrders);
				}else{
					resolve();
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	public getOrder(options: IGetOrderOpts): Promise<Order> {
		return new Promise(async (resolve, reject) => {
			try {
				let query: QueryOrder;
				let url: string = '/v3/order';
				let callOpts: CallOptions;
				let privateCall: IQueryOrderResponse;
				let result: Order;
				let opts: IQueryOrderOpts = <IQueryOrderOpts>{};
				opts.symbol = options.symbol;
				opts.recvWindow = options.recvWindow;
				opts.orderId = options.orderId;
				opts.origClientOrderId = options.origClientOrderId;

				query = new QueryOrder(opts);
				callOpts = new CallOptions(EMethod.GET, true, false, false);
				privateCall = await this.privateCall(url, callOpts, query);

				if (privateCall && privateCall.hasOwnProperty("symbol")) {
					let nOrder: IOrder = <IOrder>{};
					nOrder.symbol = opts.symbol;
					nOrder.side = privateCall.side;
					nOrder.price = privateCall.price;
					nOrder.type = privateCall.type;
					nOrder.timeInForce = privateCall.timeInForce;
					nOrder.origQty = privateCall.origQty;
					nOrder.executedQty = privateCall.executedQty;
					nOrder.timestamp = privateCall.time;
					nOrder.status = privateCall.status;
					nOrder.orderId = opts.orderId;
					nOrder.clientOrderId = privateCall.clientOrderId;
					nOrder.cummulativeQuoteQty = privateCall.cummulativeQuoteQty;
					nOrder.status = privateCall.status;
					nOrder.signature = privateCall.signature;
					nOrder.transactTime = privateCall.time;
					nOrder.isWorking = privateCall.isWorking;
					result = new Order(nOrder);
					resolve(result);
				}else{
					resolve();
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	public getPrices(): Promise<Price[]> {
		return new Promise(async (resolve, reject) => {
			let callOpts: CallOptions = new CallOptions(EMethod.GET, true, true, false, this.options.auth.key);
			let url: string = '/v1/ticker/allPrices';

			try {
				let rawPrices: IPrice[] = await this.call(url, callOpts);
				if (Array.isArray(rawPrices) && rawPrices.length > 0) {
					let prices = Price.toPrices(rawPrices);
					resolve(prices);
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	public static getQuoteAssetName(symbol: string): string {
		let qa: string;
		let marketFilter: Market[] = Binance.markets.filter(market => market.symbol === symbol);
		let market: Market;
		if (marketFilter && marketFilter.length > 0) {
			market = marketFilter[0];
			qa = market.quoteAsset;
		}
		return qa;
	}

	public getStatus(): Promise<ISystemStatus> {
		return new Promise(async (resolve, reject) => {
			try {
				let opts: CallOptions = new CallOptions(EMethod.GET, true, true, false, this.options.auth.key);
				let status: ISystemStatus = await this.call('/wapi/v3/systemStatus.html', opts);
				resolve(status);
			} catch (err) {
				reject(`Error retrieving the system status. Message: ${err}`);
			}
		});
	}

	public getWithdrawHisory(request: IWithdrawHistoryReq): Promise<IWithdrawHistoryResult> {
		return new Promise(async (resolve, reject) => {
			try {
				let url: string = '/wapi/v3/withdrawHistory.html';
				let callOpts: CallOptions = new CallOptions(EMethod.GET, true, false, false);
				let withdrawHistory: IWithdrawHistoryResult = await this.privateCall(url, callOpts, request);
				resolve(withdrawHistory);
			} catch (err) {
				reject(err);
			}
		});
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

	public limitBuy(options: ILimitOrderOpts): Promise<Order | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let order: NewOrder;
				let orderRes:  Order | {};
				let nOrder: INewOrder = <INewOrder>{};

				const TYPE: EOrderType = EOrderType.LIMIT;
				const SIDE: EOrderSide = EOrderSide.BUY;
				const RESPONSE_TYPE: ENewOrderRespType = ENewOrderRespType.FULL;

				nOrder.recvWindow = options.recvWindow;
				nOrder.type = EOrderType[TYPE];
				nOrder.side = EOrderSide[SIDE];
				nOrder.quantity = options.quantity;
				nOrder.stopPrice = options.stopPrice;
				nOrder.icebergQty =options.iceburgQty;
				nOrder.newClientOrderId = options.newClientOrderId;
				nOrder.newOrderRespType = ENewOrderRespType[options.newOrderRespType] || ENewOrderRespType[RESPONSE_TYPE];

				order = new NewOrder(nOrder);
				orderRes = await this._newOrder(order);
				resolve(orderRes);
			} catch (err) {
				reject(err);
			}
		});
	}

	public limitSell(options: ILimitOrderOpts): Promise<Order | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let order: NewOrder;
				let orderRes:  Order | {};
				let nOrder: INewOrder = <INewOrder>{};
				const TYPE: EOrderType = EOrderType.LIMIT;
				const SIDE: EOrderSide = EOrderSide.SELL;
				const RESPONSE_TYPE: ENewOrderRespType = ENewOrderRespType.FULL;

				nOrder.recvWindow = options.recvWindow;
				nOrder.type = EOrderType[TYPE];
				nOrder.side = EOrderSide[SIDE];
				nOrder.quantity = options.quantity;
				nOrder.stopPrice = options.stopPrice;
				nOrder.icebergQty =options.iceburgQty;
				nOrder.newClientOrderId = options.newClientOrderId;
				nOrder.newOrderRespType = ENewOrderRespType[options.newOrderRespType] || ENewOrderRespType[RESPONSE_TYPE];

				order = new NewOrder(nOrder);
				orderRes = await this._newOrder(order);
				resolve(orderRes);
			} catch (err) {
				reject(err)
			}
		});
	}

	public marketBuy(options: IMarketOrderOpts): Promise<Order | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let order: NewOrder;
				let orderRes:  Order | {};
				let nOrder: INewOrder = <INewOrder>{};

				const TYPE: EOrderType = EOrderType.MARKET;
				const SIDE: EOrderSide = EOrderSide.BUY;
				const RESPONSE_TYPE: ENewOrderRespType = ENewOrderRespType.FULL;

				nOrder.recvWindow = options.recvWindow;
				nOrder.type = EOrderType[TYPE];
				nOrder.side = EOrderSide[SIDE];
				nOrder.quantity = options.quantity;
				nOrder.icebergQty = options.iceburgQty;
				nOrder.newClientOrderId = options.newClientOrderId;
				nOrder.newOrderRespType = ENewOrderRespType[options.newOrderRespType] || ENewOrderRespType[RESPONSE_TYPE];

				order = new NewOrder(nOrder);
				orderRes = await this._newOrder(order);
				resolve(orderRes);
			} catch (err) {
				reject(err);
			}
		});
	}

	public marketSell(options: IMarketOrderOpts): Promise<Order | TestOrder> {
		return new Promise(async (resolve, reject) => {
			try {
				let order: NewOrder;
				let orderRes:  Order | {};
				let nOrder: INewOrder = <INewOrder>{};

				const TYPE: EOrderType = EOrderType.MARKET;
				const SIDE: EOrderSide = EOrderSide.SELL;
				const RESPONSE_TYPE: ENewOrderRespType = ENewOrderRespType.FULL;

				nOrder.recvWindow = options.recvWindow;
				nOrder.type = EOrderType[TYPE];
				nOrder.side = EOrderSide[SIDE];
				nOrder.quantity = options.quantity;
				nOrder.icebergQty = options.iceburgQty;
				nOrder.newClientOrderId = options.newClientOrderId;
				nOrder.newOrderRespType = ENewOrderRespType[options.newOrderRespType] || ENewOrderRespType[RESPONSE_TYPE];

				order = new NewOrder(nOrder);
				orderRes = await this._newOrder(order);
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