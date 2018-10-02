import {BotHttp} from "./BotHttp";
import {TMethod} from "./TMethod";
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
import {IGetAllOrdersOpts} from "../Transaction/Interfaces/IGetAllOrdersOpts";
import {ICallOpts} from "../Rest/Interfaces/ICallOpts";

export class Rest extends BotHttp {
	public static listenKey: IListenKey;

	private async _cancelOrder(cancelOrder: CancelOrder): Promise<CancelOrderResponse> {
		try {
			let orderResRaw: ICancelOrderResponse;
			let response: CancelOrderResponse;
			let privateOrder: IQueryCancelOrder | HttpError | {};
			let url: string = (Binance.options.test) ? "/v3/order/test" : "/v3/order";
			let callOpts: CallOptions;
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'DELETE';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;
			callOpts = new CallOptions(callConfig);

			privateOrder = await this.privateCall(url, callOpts, cancelOrder);
			if (privateOrder instanceof HttpError) {
				return Promise.reject(privateOrder);
			} else {
				orderResRaw = <ICancelOrderResponse>privateOrder;
				response = new CancelOrderResponse(orderResRaw);
				return response;
			}
		} catch (err) {
			throw err;
		}
	}

	private async _getCandlesInterval(symbol: string, interval: string, limit?: number): Promise<Candle[]> {
		try {
			let candleOpts: ICandlesOptions = <ICandlesOptions>{};
			candleOpts.symbol = symbol;
			candleOpts.interval = interval;
			candleOpts.limit = limit;
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';

			let callOpts: CallOptions = new CallOptions(callConfig);
			let raw: any[][] = await this.call('/v1/klines', callOpts, candleOpts);
			let candles: Candle[] = Candle.fromHttpByInterval(raw, candleOpts.symbol, candleOpts.interval);
			candles.forEach((candle) => {
				candle.quoteAsset = Rest.getQuoteAssetName(symbol);
			});
			return candles;
		} catch (err) {
			throw err;
		}
	};

	private async _newOrder(order: NewOrder): Promise<Order | HttpError | TestOrder> {
		try {
			let orderRes: Order;
			let privateOrder: IOrder | HttpError | TestOrder;
			let url: string = (Binance.options.test) ? "/v3/order/test" : "/v3/order";

			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'POST';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;

			let callOpts: CallOptions = new CallOptions(callConfig);
			privateOrder = await this.privateCall(url, callOpts, NewOrder.toBinance(order));
			if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
				return Promise.reject(new TestOrder());
			} else {
				if (privateOrder instanceof HttpError) {
					return Promise.reject(privateOrder);
				} else {
					let order: IOrder = <IOrder>privateOrder;
					orderRes = new Order(order);
					return orderRes;
				}
			}
		} catch (err) {
			throw err;
		}
	}

	public async cancelOrder(options: ICancelOrderOpts): Promise<CancelOrderResponse> {
		try {
			let cancelResult: ICancelOrderResponse
			let result: CancelOrderResponse;
			let cancelOrder: CancelOrder = new CancelOrder(options);
			if (cancelResult) {
				cancelResult = await this._cancelOrder(cancelOrder);
				result = new CancelOrderResponse(<ICancelOrderResponse>cancelResult);
			}
			return result;
		} catch (err) {
			throw err;
		}
	}

	public async cancelOrdersBySymbol(options: ICancelOrderOpts): Promise<CancelOrderResponse[]> {
		try {
			let cancelResp: CancelOrderResponse;
			let results: CancelOrderResponse[] = [];
			let config: IGetOrderOpts = <IGetOrderOpts>{};
			config.symbol = options.symbol;
			config.origClientOrderId = options.origClientOrderId;
			config.orderId = options.orderId;
			config.recvWindow = options.recvWindow;
			let openOrders: OpenOrder[] = await this.getOpenOrders(config);
			let symbolOrders: OpenOrder[] = openOrders.filter(order => order.symbol === config.symbol);

			for (let order of symbolOrders) {
				let cOpts: ICancelOrderOpts = <ICancelOrderOpts>{};
				cOpts.orderId = order.orderId;
				cOpts.recvWindow = options.recvWindow;
				cOpts.origClientOrderId = order.clientOrderId;
				cOpts.symbol = order.symbol;
				cOpts.newClientOrderId = options.newClientOrderId;
				cancelResp = await this.cancelOrder(cOpts);
				results.push(cancelResp);
			}
			return results;
		} catch (err) {
			throw err;
		}
	}

	public async closeDataStream(): Promise<{}> {
		try {
			let result: object;

			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'DELETE';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = true;

			let callOpts: CallOptions = new CallOptions(callConfig);
			let dStream: DataStream = new DataStream(Rest.listenKey);
			result = await this.privateCall('/v1/userDataStream', callOpts, dStream);
			return result;
		} catch (err) {
			throw err;
		}
	}

	public async getAccountInfo(recvWindow?: number): Promise<OutboundAccountInfo> {
		try {
			let url: string = "/v3/account";
			let opts: AccountInfoOptions = new AccountInfoOptions(recvWindow);
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;
			let callOpts: CallOptions = new CallOptions(callConfig);
			let accountInfoRest: IOutboundAccountInfoRest = await this.privateCall(url, callOpts, opts);
			let info: OutboundAccountInfo = OutboundAccountInfo.fromBinanceRest(accountInfoRest);
			return info;
		} catch (err) {
			throw err;
		}
	}

	public async getAllOrders(options: IGetAllOrdersOpts): Promise<Order[]> {
		try {
			let query: AllOrders = new AllOrders(options);
			let url: string = '/v3/allOrders';
			let callOpts: CallOptions;

			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;
			callOpts = new CallOptions(callConfig);

			let privateCall: IQueryOrderResponse[] = await this.privateCall(url, callOpts, query);
			let results: Order[] = [];

			if (Array.isArray(privateCall) && privateCall.length > 0) {
				results = privateCall.map((qCall: IQueryOrderResponse) => {
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

			return results;
		} catch (err) {
			throw err;
		}
	}

	public async getAvailableTotalBalance(quoteAsset: string, dollarBaseAsset: string = "USDT", primaryBaseAsset: string = "BTC"): Promise<ITotalBalance> {
		try {
			//get BTC qty first
			let balances: Balance[] = await this.getBalances();
			let prices: Price[] = await this.getPrices();
			if (balances.length === 0) {
				return Promise.reject(new Error("Error: Balances not working"));
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
			return result;
		} catch (err) {
			throw err;
		}
	}

	public async getBalances(recvWindow?: number, gtZeroOnly: boolean = false): Promise<Balance[]> {
		try {
			let balances: Balance[];
			let accountInfo: OutboundAccountInfo = await this.getAccountInfo(recvWindow);
			balances = accountInfo.balances;

			if (gtZeroOnly) {
				balances = accountInfo.balances.filter(bal => bal.available > 0);
			} else {
				balances = accountInfo.balances;
			}
			return balances;
		} catch (err) {
			throw err;
		}
	}

	public async getCandles(symbols: string[], intervals: string[], limit?: number): Promise<CandleInterval[]> {
		try {
			let candleIntervals: CandleInterval[] = [];
			for (let symbol of symbols) {
				for (let interval of intervals) {
					let candles: Candle[] = await this._getCandlesInterval(symbol, interval, limit);
					let ci = new CandleInterval(candles);
					candleIntervals.push(ci);
				}
			}
			return candleIntervals;
		} catch (err) {
			throw err;
		}
	};

	public async getDataStream(): Promise<IListenKey> {
		try {
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'POST';
			callConfig.json = true;
			callConfig.noData = true;
			callConfig.noExtra = false;
			let callOpts: CallOptions = new CallOptions(callConfig);
			let signed = new Signed();
			Rest.listenKey = <IListenKey> await this.privateCall('/v1/userDataStream', callOpts, signed);
			return Rest.listenKey;
		} catch (err) {
			throw err;
		}
	}

	public async getDepositAddress(request: IDepositAddressReq): Promise<IDepositAddressResult> {
		try {
			let url: string = '/wapi/v3/depositAddress.html';
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;

			let callOpts: CallOptions = new CallOptions(callConfig);
			return <IDepositAddressResult> await this.privateCall(url, callOpts, request);
		} catch (err) {
			throw err;
		}
	}

	public async getDepositHisory(request: IDepositHistoryReq): Promise<IDepositHistoryResult> {
		try {
			let url: string = '/wapi/v3/depositHistory.html';
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;

			let callOpts: CallOptions = new CallOptions(callConfig);
			return <IDepositHistoryResult> await this.privateCall(url, callOpts, request);
		} catch (err) {
			throw err;
		}
	}

	public async getExchangeInfo(): Promise<IExchangeInfo> {
		try {
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = true;
			callConfig.noExtra = false;

			let callOpts: CallOptions = new CallOptions(callConfig, this.options.auth.key);
			return <IExchangeInfo> await this.call('/v1/exchangeInfo', callOpts);
		} catch (err) {
			throw err;
		}
	};

	public async getMarkets(quoteAsset?: string): Promise<Market[]> {
		try {
			let info: IExchangeInfo = await this.getExchangeInfo();
			let symbols: ISymbol[] = info.symbols;
			let markets: Market[] = symbols.map(symbol => {
				return new Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market.GetLimitsFromBinanceSymbol(symbol));
			});
			Binance.markets = markets;
			return markets;
		} catch (err) {
			throw err;
		}
	}

	public async getOpenOrders(options: IGetOrderOpts): Promise<OpenOrder[]> {
		try {
			let opts: IQueryOrderOpts = <IQueryOrderOpts>{};
			let url: string = "/v3/openOrders";
			let query: QueryOrder;
			let callOpts: CallOptions;
			let privateCall: IOpenOrder[];
			let callConfig: ICallOpts = <ICallOpts>{}

			opts.symbol = options.symbol;
			opts.recvWindow = options.recvWindow;
			opts.orderId = options.orderId;
			opts.origClientOrderId = options.origClientOrderId;
			query = new QueryOrder(opts);
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;
			callOpts = new CallOptions(callConfig);
			privateCall = await this.privateCall(url, callOpts, query);
			if (Array.isArray(privateCall) && privateCall.length > 0) {
				return <OpenOrder[]> privateCall.map((o: IOpenOrder) => {
					return new OpenOrder(o);
				});
			} else {
				return;
			}
		} catch (err) {
			throw err;
		}
	}

	public async getOrder(options: IGetOrderOpts): Promise<Order> {
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

			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;
			callOpts = new CallOptions(callConfig);
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
				return result;
			} else {
				return;
			}
		} catch (err) {
			throw err;
		}
	}

	public async getPrices(): Promise<Price[]> {
		try {
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = true;
			callConfig.noExtra = false;
			let callOpts: CallOptions = new CallOptions(callConfig, this.options.auth.key);
			let url: string = '/v1/ticker/allPrices';
			let rawPrices: IPrice[] = await this.call(url, callOpts);
			if (Array.isArray(rawPrices) && rawPrices.length > 0) {
				return <Price[]> Price.toPrices(rawPrices);
			}
		} catch (err) {
			throw err;
		}
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

	public async getStatus(): Promise<ISystemStatus> {
		try {
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = true;
			callConfig.noExtra = false;

			let opts: CallOptions = new CallOptions(callConfig, this.options.auth.key);
			return <ISystemStatus> await this.call('/wapi/v3/systemStatus.html', opts);
		} catch (err) {
			return Promise.reject(new Error(`Error retrieving the system status. Message: ${err}`));
		}
	}

	public async getWithdrawHisory(request: IWithdrawHistoryReq): Promise<IWithdrawHistoryResult> {
		try {
			let url: string = '/wapi/v3/withdrawHistory.html';
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = false;

			let callOpts: CallOptions = new CallOptions(callConfig);
			let withdrawHistory: IWithdrawHistoryResult = await this.privateCall(url, callOpts, request);
			return withdrawHistory;
		} catch (err) {
			throw err;
		}
	}

	public async keepDataStream(): Promise<{}> {
		try {
			let callConfig: ICallOpts = <ICallOpts>{};
			callConfig.method = 'PUT';
			callConfig.json = true;
			callConfig.noData = false;
			callConfig.noExtra = true;

			let callOpts: CallOptions = new CallOptions(callConfig);
			let dStream: DataStream = new DataStream(Rest.listenKey);
			return <{}> await this.privateCall('/v1/userDataStream', callOpts, dStream);
		} catch (err) {
			throw err;
		}
	}

	public async limitBuy(options: ILimitOrderOpts): Promise<Order | TestOrder> {
		try {
			let order: NewOrder;
			let orderRes: Order | {};
			let nOrder: INewOrder = <INewOrder>{};

			const TYPE: EOrderType = EOrderType.LIMIT;
			const SIDE: EOrderSide = EOrderSide.BUY;
			const RESPONSE_TYPE: ENewOrderRespType = ENewOrderRespType.FULL;

			nOrder.recvWindow = options.recvWindow;
			nOrder.type = EOrderType[TYPE];
			nOrder.side = EOrderSide[SIDE];
			nOrder.quantity = options.quantity;
			nOrder.stopPrice = options.stopPrice;
			nOrder.icebergQty = options.iceburgQty;
			nOrder.newClientOrderId = options.newClientOrderId;
			nOrder.newOrderRespType = ENewOrderRespType[options.newOrderRespType] || ENewOrderRespType[RESPONSE_TYPE];

			order = new NewOrder(nOrder);
			return await this._newOrder(order);
		} catch (err) {
			throw err;
		}
	}

	public async limitSell(options: ILimitOrderOpts): Promise<Order | TestOrder> {
		try {
			let order: NewOrder;
			let nOrder: INewOrder = <INewOrder>{};
			const TYPE: EOrderType = EOrderType.LIMIT;
			const SIDE: EOrderSide = EOrderSide.SELL;
			const RESPONSE_TYPE: ENewOrderRespType = ENewOrderRespType.FULL;

			nOrder.recvWindow = options.recvWindow;
			nOrder.type = EOrderType[TYPE];
			nOrder.side = EOrderSide[SIDE];
			nOrder.quantity = options.quantity;
			nOrder.stopPrice = options.stopPrice;
			nOrder.icebergQty = options.iceburgQty;
			nOrder.newClientOrderId = options.newClientOrderId;
			nOrder.newOrderRespType = ENewOrderRespType[options.newOrderRespType] || ENewOrderRespType[RESPONSE_TYPE];

			order = new NewOrder(nOrder);
			return await this._newOrder(order);
		} catch (err) {
			throw err;
		}
	}

	public async marketBuy(options: IMarketOrderOpts): Promise<Order | TestOrder> {
		try {
			let order: NewOrder;
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
			return await this._newOrder(order);
		} catch (err) {
			throw err;
		}
	}

	public async marketSell(options: IMarketOrderOpts): Promise<Order | TestOrder> {
		try {
			let order: NewOrder;
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
			return await this._newOrder(order);
		} catch (err) {
			throw err;
		}
	}

	constructor(options: IBinanceOptions) {
		super(options);
	}
}