import {BotHttp} from "./BotHttp";
import {IListenKey} from "./Interfaces/IListenKey";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ICandleRequest} from "../ExchangeInfo/Interfaces/ICandleRequest";
import {CandleInterval} from "../ExchangeInfo/CandleInterval";
import {Candle} from "../ExchangeInfo/Candle";
import {Market} from "../Market/Market";
import {Binance} from "../Binance/Binance";
import {NewOrder} from "../Transaction/NewOrder";
import {ENewOrderRespType, EOrderSide, EOrderType} from "../Transaction/Interfaces/EOrderEnums";
import {IOrder} from "../Transaction/Interfaces/IOrder";
import {Order} from "../Transaction/Order";
import {HttpError} from "../Error/HttpError";
import {CancelOrder} from "../Transaction/CancelOrder";
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
import {ICancelOrderOpts} from "../Transaction/Interfaces/ICancelOrderOpts";
import {ITotalBalance} from "../Balances/Interfaces/ITotalBalance";
import {Price} from "../Transaction/Price";
import {IPrice} from "../Transaction/Interfaces/IPrice";

export class Rest extends BotHttp {
	public static listenKey: IListenKey;

	private async _cancelOrder(cancelOrder: CancelOrder): Promise<CancelOrderResponse> {
		try {
			let callConfig: ICallOpts = <ICallOpts>{};
			let orderResRaw: ICancelOrderResponse;
			let response: CancelOrderResponse;
			let privateOrder: IQueryCancelOrder | HttpError | {};
			let callOpts: CallOptions;
			callConfig.uri = (Binance.options.test) ? `${BotHttp.BASE}/v3/order/test` : `${BotHttp.BASE}/v3/order`;
			callConfig.method = 'DELETE';
			callConfig.json = true;
			callConfig.isSigned = true;
			callConfig.qs = cancelOrder;
			callOpts = new CallOptions(callConfig);

			privateOrder = await this.privateCall(callOpts);
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

	private async _getCandlesInterval(candleOpts: ICandleRequest): Promise<Candle[]> {
		let candles: Candle[];
		let raw: any[][];
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.uri = `${BotHttp.BASE}/v1/klines`;
		callConfig.qs = candleOpts;
		callConfig.isSigned = false;
		callOpts = new CallOptions(callConfig);

		try {
			raw = await this.call(callOpts);
			candles = Candle.fromHttpByInterval(raw, candleOpts.symbol, candleOpts.interval);
			candles.forEach((candle) => {
				candle.quoteAsset = Rest.getQuoteAssetName(candleOpts.symbol);
			});
			return candles;
		} catch (err) {
			throw err;
		}
	};

	private async _newOrder(order: NewOrder): Promise<Order | HttpError | TestOrder> {
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		let orderRes: Order;
		let privateOrder: IOrder | HttpError | TestOrder;
		callConfig.uri = (Binance.options.test) ? `${BotHttp.BASE}/v3/order/test` : `${BotHttp.BASE}/v3/order`;
		callConfig.method = 'POST';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.qs = order.toObjLiteral();

		try {
			callOpts = new CallOptions(callConfig);
			privateOrder = await this.privateCall(callOpts);
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
			let cancelResult: ICancelOrderResponse;
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
		let cOpts: ICancelOrderOpts;
		let symbolOrders: OpenOrder[];
		let openOrders: OpenOrder[];
		let cancelResp: CancelOrderResponse;
		let results: CancelOrderResponse[] = [];
		let config: IGetOrderOpts = <IGetOrderOpts>{};

		try {
			config.symbol = options.symbol;
			config.origClientOrderId = options.origClientOrderId;
			config.orderId = options.orderId;
			config.recvWindow = options.recvWindow;
			openOrders = await this.getOpenOrders(config);
			symbolOrders = openOrders.filter(order => order.symbol === config.symbol);

			for (let order of symbolOrders) {
				cOpts = <ICancelOrderOpts>{};
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
		let callOpts: CallOptions;
		let dStream: DataStream;
		let result: object;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'DELETE';
		callConfig.json = true;
		callConfig.isSigned = false;
		callConfig.uri = `${BotHttp.BASE}/v1/userDataStream`;
		callConfig.qs = new DataStream(Rest.listenKey);

		try {
			callOpts = new CallOptions(callConfig);
			result = await this.privateCall(callOpts);
			return result;
		} catch (err) {
			throw err;
		}
	}

	public async getAccountInfo(recvWindow?: number): Promise<OutboundAccountInfo> {
		let callOpts: CallOptions;
		let accountInfoRest: IOutboundAccountInfoRest;
		let info: OutboundAccountInfo;
		let opts: AccountInfoOptions = new AccountInfoOptions(recvWindow);
		let callConfig: ICallOpts = <ICallOpts>{};
		try {
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.isSigned = true;
			callConfig.uri = `${BotHttp.BASE}/v3/account`;
			callConfig.qs = opts;
			callOpts = new CallOptions(callConfig);
			accountInfoRest = await this.privateCall(callOpts);
			info = OutboundAccountInfo.fromBinanceRest(accountInfoRest);
			return info;
		} catch (err) {
			throw err;
		}
	}

	public async getAllOrders(options: IGetAllOrdersOpts): Promise<Order[]> {
		let results: Order[];
		let privateCall: IQueryOrderResponse[];
		let query: AllOrders;
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		query = new AllOrders(options);
		results = [];
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.uri = `${BotHttp.BASE}/v3/allOrders`;
		callConfig.qs = query.toObjLiteral();
		try {
			callOpts = new CallOptions(callConfig);
			privateCall = await this.privateCall(callOpts);

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
					let req: ICandleRequest = <ICandleRequest>{};
					req.symbol = symbol;
					req.interval = interval;
					req.limit = limit;
					let candles: Candle[] = await this._getCandlesInterval(req);
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
		let callOpts: CallOptions;
		let callConfig: ICallOpts;
		callConfig = <ICallOpts>{};
		callConfig.method = 'POST';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.uri = `${BotHttp.BASE}/v1/userDataStream`;

		try {
			callOpts = new CallOptions(callConfig);
			Rest.listenKey = <IListenKey> await this.privateCall(callOpts);
			return Rest.listenKey;
		} catch (err) {
			throw err;
		}
	}

	public async getDepositAddress(request: IDepositAddressReq): Promise<IDepositAddressResult> {
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.uri = `${BotHttp.BASE}/wapi/v3/depositAddress.html`;
		callConfig.qs = request;

		try {
			callOpts = new CallOptions(callConfig);
			return <IDepositAddressResult> await this.privateCall(callOpts);
		} catch (err) {
			throw err;
		}
	}

	public async getDepositHisory(request: IDepositHistoryReq): Promise<IDepositHistoryResult> {
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.uri = `${BotHttp.BASE}/wapi/v3/depositHistory.html`;
		callConfig.qs = request;
		try {
			callOpts = new CallOptions(callConfig);
			return <IDepositHistoryResult> await this.privateCall(callOpts);
		} catch (err) {
			throw err;
		}
	}

	public async getExchangeInfo(): Promise<IExchangeInfo> {
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.uri = `${BotHttp.BASE}/v1/exchangeInfo`;
		callConfig.apiKey = this.options.auth.key;

		try {
			callOpts = new CallOptions(callConfig);
			return <IExchangeInfo> await this.call(callOpts);
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
			if(quoteAsset){
				let _markets: Market[] = markets.filter(m=>m.quoteAsset===quoteAsset);
				Binance.markets = _markets;
				return _markets;
			}else{
				Binance.markets = markets;
				return markets;
			}
		} catch (err) {
			throw err;
		}
	}

	public async getOpenOrders(options: IGetOrderOpts): Promise<OpenOrder[]> {
		let opts: IQueryOrderOpts = <IQueryOrderOpts>{};
		let query: QueryOrder;
		let callOpts: CallOptions;
		let privateCall: IOpenOrder[];
		let callConfig: ICallOpts = <ICallOpts>{};

		try {
			opts.symbol = options.symbol;
			opts.recvWindow = options.recvWindow;
			opts.orderId = options.orderId;
			opts.origClientOrderId = options.origClientOrderId;
			query = new QueryOrder(opts);
			callConfig.method = 'GET';
			callConfig.json = true;
			callConfig.isSigned = true;
			callConfig.uri = `${BotHttp.BASE}/v3/openOrders`;
			callConfig.qs = query.toObjLiteral();
			callOpts = new CallOptions(callConfig);
			privateCall = await this.privateCall(callOpts);
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
			callConfig.isSigned = true;
			callConfig.uri = `${BotHttp.BASE}/v3/order`;
			callConfig.qs = query.toObjLiteral();
			callOpts = new CallOptions(callConfig);
			privateCall = await this.privateCall(callOpts);

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
		let rawPrices: IPrice[];
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.apiKey = this.options.auth.key;
		callConfig.uri = `${BotHttp.BASE}/api/v3/ticker/price`;

		try {
			callOpts = new CallOptions(callConfig);
			rawPrices = await this.call(callOpts);
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
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.apiKey = this.options.auth.key;
		callConfig.uri = `${BotHttp.BASE}/wapi/v3/systemStatus.html`;

		try {
			let opts: CallOptions = new CallOptions(callConfig);
			return <ISystemStatus> await this.call(opts);
		} catch (err) {
			return Promise.reject(new Error(`Error retrieving the system status. Message: ${err}`));
		}
	}

	public async getWithdrawHisory(request: IWithdrawHistoryReq): Promise<IWithdrawHistoryResult> {
		let withdrawHistory: IWithdrawHistoryResult;
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.uri = `${BotHttp.BASE}/wapi/v3/withdrawHistory.html`;
		callConfig.qs = request;

		try {
			callOpts = new CallOptions(callConfig);
			withdrawHistory = await this.privateCall(callOpts);
			return withdrawHistory;
		} catch (err) {
			throw err;
		}
	}

	public async keepDataStream(): Promise<{}> {
		let dStream: DataStream;
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		dStream = new DataStream(Rest.listenKey);
		callConfig.method = 'PUT';
		callConfig.json = true;
		callConfig.isSigned = false;
		callConfig.uri = `${BotHttp.BASE}/v1/userDataStream`;
		callConfig.qs = dStream;
		try {
			callOpts = new CallOptions(callConfig);
			return <{}> await this.privateCall( callOpts);
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