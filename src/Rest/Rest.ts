import {BotHttp} from "./BotHttp";
import {IListenKey} from "./Interfaces/IListenKey";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {ICandleRequest} from "../ExchangeInfo/Interfaces/ICandleRequest";
import {CandleInterval} from "../ExchangeInfo/CandleInterval";
import {Candle} from "../ExchangeInfo/Candle";
import {Market} from "../Market/Market";
import {Binance} from "../Binance/Binance";
import {NewOrder} from "../Transaction/NewOrder";
import {TNewOrderRespType, TOrderSide, TOrderType} from "../Transaction/Interfaces/EOrderEnums";
import {IOrder} from "../Transaction/Interfaces/IOrder";
import {Order} from "../Transaction/Order";
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
import {IGetTotalBalanceOpts} from "../Balances/Interfaces/IGetTotalBalanceOpts";
import {GetTotalBalanceOpts} from "../Balances/GetTotalBalanceOpts";
import {I24hrTickerResponse} from "../ExchangeInfo/Interfaces/I24hrTickerResponse";

export class Rest extends BotHttp {
	public static listenKey: IListenKey;
	public binance: Binance;
	private _markets: Market[]=[];
	set markets(markets: Promise<Market[]>|Market[]){
		(async ()=>{
			if(markets){
				this._markets = await markets;
			}
		})();
	}
	get markets(): Promise<Market[]>|Market[] {
		return new Promise(async (resolve, reject)=>{
			try{
				if(this._markets && this._markets.length > 0){
					return resolve(this._markets);
				}else{
					this._markets = await this.getMarkets();
					return resolve(this._markets);
				}
			}catch(err){
				reject(err);
			}
		});
	}
	private async _cancelOrder(cancelOrder: CancelOrder): Promise<CancelOrderResponse> {
		try {
			let callConfig: ICallOpts = <ICallOpts>{};
			let orderResRaw: ICancelOrderResponse;
			let response: CancelOrderResponse;
			let privateOrder: IQueryCancelOrder | Error | {};
			let callOpts: CallOptions;
			callConfig.uri = (Binance.options.test) ? `${BotHttp.BASE}/api/v3/order/test` : `${BotHttp.BASE}/api/v3/order`;
			callConfig.method = 'DELETE';
			callConfig.json = true;
			callConfig.isSigned = true;
			callConfig.qs = cancelOrder;
			callOpts = new CallOptions(callConfig);

			privateOrder = await this.privateCall(callOpts);
			if (privateOrder instanceof Error) {
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
		let lastCandle: Candle;
		let lastIdx: number;
		let now: number;
		let candles: Candle[];
		let raw: any[][];
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.uri = `${BotHttp.BASE}/api/v1/klines`;
		callConfig.qs = candleOpts;
		callConfig.isSigned = false;
		callOpts = new CallOptions(callConfig);

		try {
			raw = await this.call(callOpts);
			now = Date.now();
			candles = Candle.fromRestStream(raw, candleOpts.symbol, candleOpts.interval);
			lastIdx = candles.length - 1;
			lastCandle = candles[lastIdx];
			if(lastCandle.closeTime.getTime() > now){
				candles.splice(lastIdx, 1);
			}
			return candles;
		} catch (err) {
			throw err;
		}
	};
	private async _newOrder(order: NewOrder): Promise<Order | Error | TestOrder> {
		let self = this;
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		let orderRes: Order;
		let privateOrder: IOrder | Error | TestOrder;
		callConfig.uri = (Binance.options.test) ? `${BotHttp.BASE}/api/v3/order/test` : `${BotHttp.BASE}/api/v3/order`;
		callConfig.method = 'POST';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.qs = order.toObjLiteral();

		try {
			callOpts = new CallOptions(callConfig);
			privateOrder = await self.privateCall(callOpts);

			if (self.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
				return new TestOrder();
			} else {
				if (privateOrder instanceof Error) {
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
			if (cancelOrder && cancelOrder.orderId) {
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
		config.symbol = options.symbol;
		config.origClientOrderId = options.origClientOrderId;
		config.orderId = options.orderId;
		config.recvWindow = options.recvWindow;

		try {
			openOrders = await this.getOpenOrders(config);
			if (!openOrders || openOrders.length === 0) {
				return [];
			}
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
	public async closeDataStream(): Promise<object> {
		let callOpts: CallOptions;
		let result: object;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'DELETE';
		callConfig.json = true;
		callConfig.isSigned = false;
		callConfig.uri = `${BotHttp.BASE}/api/v1/userDataStream`;
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
		let self = this;
		let callOpts: CallOptions;
		let accountInfoRest: IOutboundAccountInfoRest;
		let info: OutboundAccountInfo;
		let opts: AccountInfoOptions = new AccountInfoOptions(recvWindow);
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.uri = `${BotHttp.BASE}/api/v3/account`;
		callConfig.qs = opts;

		try {
			callOpts = new CallOptions(callConfig);
			accountInfoRest = await self.privateCall(callOpts);
			info = OutboundAccountInfo.fromBinanceRest(accountInfoRest);
			return info;
		} catch (err) {
			throw err;
		}
	}
	public async getAllCandles(symbols: string[], intervals: string[], limit?: number): Promise<CandleInterval[]> {
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

	// The 'xChangeRatioBA' is BTC indefinitely and is the base asset of Binance's "Exchange Ratio".
	// See:  https://support.binance.com/hc/en-us/articles/115000583311
	// Here is the formula excerpt: "Exchange ratio of NEO/BNB = NEO/BTC[market price] /(BNB/BTC [market price]).}
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
		callConfig.uri = `${BotHttp.BASE}/api/v3/allOrders`;
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
	public async getAvailableTotalBalance(opts?: IGetTotalBalanceOpts): Promise<ITotalBalance[]> {
		let results: ITotalBalance[] = [];
		let result = <ITotalBalance>{};
		let prices: Price[];
		let balances: Balance[];
		let config: GetTotalBalanceOpts;
		let balVals: ITotalBalance[];

		try {
			config = new GetTotalBalanceOpts(opts);
			balances = await this.getBalances(config.recvWindow, true);
			prices = await this.getPrices();
			if (balances.length === 0) {
				return Promise.reject(new Error("Error: Balances not working"));
			}

			const QA = config.quoteAsset;
			const USDT = config.usdAsset;
			const BTC = config.xChangeRatioBA;

			balVals = [];
			result = <ITotalBalance>{};
			balances.forEach((bal: Balance) => {
				let exchangeValue: number;
				let totalBTCVal: number;
				let avail: ITotalBalance = <ITotalBalance>{};
				let BA: string = bal.asset;
				let available: number = bal.available;
				let symbol: string;

				if (BA !== BTC && BTC !== QA) {
					symbol = BA + BTC;
					exchangeValue = Price.GetPriceValue(prices, symbol);
					avail.quoteAsset = QA;
					totalBTCVal = available * exchangeValue;
					avail.totalVal = totalBTCVal * Price.GetPriceValue(prices, BTC + USDT);
					balVals.push(avail);
				} else {
					if (BA === BTC && BTC !== QA) {
						avail.quoteAsset = QA;
						avail.totalVal = available * Price.GetPriceValue(prices, BTC + USDT);
						balVals.push(avail);
					} else if (QA === BTC && BA !== BTC) {
						symbol = BA + QA;
						exchangeValue = Price.GetPriceValue(prices, symbol);
						avail.quoteAsset = QA;
						avail.totalVal = available * exchangeValue;
						balVals.push(avail);
					} else if (BTC === QA && BA === BTC) {
						avail.quoteAsset = QA;
						avail.totalVal = available;
						balVals.push(avail);
					}
				}
			});

			result.totalVal = balVals.reduce((prev, cur) => {
				return prev + cur.totalVal;
			}, 0);
			result.quoteAsset = QA;
			results.push(result);

			if (QA !== USDT) {
				let result2: ITotalBalance = <ITotalBalance>{};
				result2.totalVal = result.totalVal * Price.GetPriceValue(prices, BTC + USDT);
				result2.quoteAsset = "USDT";
				results.push(result2);
			}
			return results;
		} catch (err) {
			throw err;
		}
	}
	public async getBalances(recvWindow?: number, gtZeroOnly: boolean = true): Promise<Balance[]> {
		try {
			let balances: Balance[];
			let accountInfo: OutboundAccountInfo = await this.getAccountInfo(recvWindow);
			balances = accountInfo.balances;

			if (gtZeroOnly && accountInfo.balances.length > 0) {
				balances = accountInfo.balances.filter(bal => bal.available > 0);
			} else {
				balances = accountInfo.balances;
			}
			return balances;
		} catch (err) {
			throw err;
		}
	}
	public async getCandlesBySymbol(symbol: string, intervals: string[], limit?: number): Promise<CandleInterval[]> {
		let candleIntervals: CandleInterval[] = [];
		try {
			for (let interval of intervals) {
				let req: ICandleRequest = <ICandleRequest>{};
				req.symbol = symbol;
				req.interval = interval;
				req.limit = limit;
				let candles: Candle[] = await this._getCandlesInterval(req);
				let ci = new CandleInterval(candles);
				candleIntervals.push(ci);
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
		callConfig.isSigned = false;
		callConfig.uri = `${BotHttp.BASE}/api/v1/userDataStream`;

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
		let self = this;
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.uri = `${BotHttp.BASE}/api/v1/exchangeInfo`;

		try {
			callOpts = new CallOptions(callConfig);
			return <IExchangeInfo> await self.call(callOpts);
		} catch (err) {
			throw err;
		}
	}
	public async getMarkets(quoteAsset?: string): Promise<Market[]> {
		try {
			let self = this;
			let info: IExchangeInfo = await self.getExchangeInfo();
			let symbols: ISymbol[] = info.symbols;
			let markets: Market[] = symbols.map(symbol => {
				return new Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market.GetLimitsFromBinanceSymbol(symbol));
			});
			if (quoteAsset && markets.length > 0) {
				this._markets = markets.filter(m => m.quoteAsset === quoteAsset);
				return this._markets;
			} else {
				this._markets = markets;
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
			callConfig.uri = `${BotHttp.BASE}/api/v3/openOrders`;
			callConfig.qs = query.toObjLiteral();
			callOpts = new CallOptions(callConfig);
			privateCall = await this.privateCall(callOpts);
			if (Array.isArray(privateCall) && privateCall.length > 0) {
				return <OpenOrder[]> privateCall.map((o: IOpenOrder) => {
					return new OpenOrder(o);
				});
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
			callConfig.uri = `${BotHttp.BASE}/api/v3/order`;
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
			}
		} catch (err) {
			throw err;
		}
	}
	public async get24hrTicker(symbol?: string): Promise<I24hrTickerResponse[]>{
		let self = this;
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.uri = `${BotHttp.BASE}/api/v1/ticker/24hr`;

		try {
			callOpts = new CallOptions(callConfig);
			if(symbol && typeof symbol === "string"){
				return <I24hrTickerResponse[]> [await self.call(callOpts)];
			}else{
				return <I24hrTickerResponse[]> await self.call(callOpts);
			}
		} catch (err) {
			throw err;
		}
	}
	public async getPrices(): Promise<Price[]> {
		let self = this;
		let rawPrices: IPrice[];
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = false;
		callConfig.uri = `${BotHttp.BASE}/api/v3/ticker/price`;

		try {
			callOpts = new CallOptions(callConfig);
			rawPrices = await self.call(callOpts);
			if (Array.isArray(rawPrices) && rawPrices.length > 0) {
				return <Price[]> Price.toPrices(rawPrices);
			}
		} catch (err) {
			throw err;
		}
	}

	//TODO: Check Signed on binance api docs and match to callOptions of each method.
	public async getStatus(): Promise<ISystemStatus> {
		let self = this;
		let callConfig: ICallOpts = <ICallOpts>{};
		callConfig.method = 'GET';
		callConfig.json = true;
		callConfig.isSigned = true;
		callConfig.apiKey = self.options.auth.key;
		callConfig.uri = `${BotHttp.BASE}/wapi/v3/systemStatus.html`;

		try {
			let opts: CallOptions = new CallOptions(callConfig);
			return <ISystemStatus> await self.call(opts);
		} catch (err) {
			return Promise.reject(new Error(`Error retrieving the system status. Message: ${err}`));
		}
	}
	public async getWithdrawHisory(request: IWithdrawHistoryReq): Promise<IWithdrawHistoryResult> {
		let self = this;
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
			withdrawHistory = await self.privateCall(callOpts);
			return withdrawHistory;
		} catch (err) {
			throw err;
		}
	}
	public async keepDataStream(): Promise<{}> {
		let self = this;
		let dStream: DataStream;
		let callOpts: CallOptions;
		let callConfig: ICallOpts = <ICallOpts>{};
		dStream = new DataStream(Rest.listenKey);
		callConfig.method = 'PUT';
		callConfig.json = true;
		callConfig.isSigned = false;
		callConfig.uri = `${BotHttp.BASE}/api/v1/userDataStream`;
		callConfig.qs = dStream;
		try {
			callOpts = new CallOptions(callConfig);
			return <{}> await self.privateCall(callOpts);
		} catch (err) {
			throw err;
		}
	}
	public async limitBuy(options: ILimitOrderOpts): Promise<Order | TestOrder> {
		let self = this;
		let orderObj: NewOrder;
		let nOrder: INewOrder = <INewOrder>{};
		const TYPE: TOrderType = 'LIMIT';
		const SIDE: TOrderSide = 'BUY';
		const RESPONSE_TYPE: TNewOrderRespType = 'FULL';

		try {
			if (options && options.price) {
				nOrder.timeInForce = options.timeInForce;
				nOrder.price = options.price.toString();
				nOrder.symbol = options.symbol;
				nOrder.recvWindow = options.recvWindow;
				nOrder.type = TYPE;
				nOrder.side = SIDE;
				nOrder.quantity = options.quantity;
				nOrder.stopPrice = options.stopPrice;
				nOrder.icebergQty = options.iceburgQty;
				nOrder.newClientOrderId = options.newClientOrderId;
				nOrder.newOrderRespType = options.newOrderRespType || RESPONSE_TYPE;
				orderObj = new NewOrder(nOrder);
				return await self._newOrder(orderObj);
			}
		} catch (err) {
			throw err;
		}
	}
		public async limitSell(options: ILimitOrderOpts): Promise<Order | TestOrder> {
		try {
			let order: NewOrder;
			let nOrder: INewOrder = <INewOrder>{};
			const TYPE: TOrderType = 'LIMIT';
			const SIDE: TOrderSide = 'SELL';
			const RESPONSE_TYPE: TNewOrderRespType = 'FULL';

			if (options && options.price) {
				nOrder.timeInForce = options.timeInForce;
				nOrder.price = options.price.toString();
				nOrder.symbol = options.symbol;
				nOrder.recvWindow = options.recvWindow;
				nOrder.type = TYPE;
				nOrder.side = SIDE;
				nOrder.quantity = options.quantity;
				nOrder.stopPrice = options.stopPrice;
				nOrder.icebergQty = options.iceburgQty;
				nOrder.newClientOrderId = options.newClientOrderId;
				nOrder.newOrderRespType = options.newOrderRespType || RESPONSE_TYPE;

				order = new NewOrder(nOrder);
				return await this._newOrder(order);
			}
		} catch (err) {
			throw err;
		}
	}
	public async marketBuy(options: IMarketOrderOpts): Promise<Order | TestOrder> {
		let self = this;
		let order: NewOrder;
		let nOrder: INewOrder = <INewOrder>{};

		try {
			nOrder.recvWindow = options.recvWindow;
			nOrder.type = 'MARKET';
			nOrder.side = 'BUY';
			nOrder.quantity = options.quantity;
			nOrder.symbol = options.symbol;
			nOrder.recvWindow = options.recvWindow;
			nOrder.quantity = options.quantity;
			nOrder.icebergQty = options.iceburgQty;
			nOrder.newClientOrderId = options.newClientOrderId;
			nOrder.newOrderRespType = options.newOrderRespType || 'FULL';

			order = new NewOrder(nOrder);
			return await self._newOrder(order);
		} catch (err) {
			throw err;
		}
	}
	public async marketSell(options: IMarketOrderOpts): Promise<Order | TestOrder> {
		let self = this;
		let order: NewOrder;
		let nOrder: INewOrder = <INewOrder>{};

		try {
			nOrder.recvWindow = options.recvWindow;
			nOrder.type = 'MARKET';
			nOrder.side = 'SELL';
			nOrder.quantity = options.quantity;
			nOrder.symbol = options.symbol;
			nOrder.recvWindow = options.recvWindow;
			nOrder.quantity = options.quantity;
			nOrder.icebergQty = options.iceburgQty;
			nOrder.newClientOrderId = options.newClientOrderId;
			nOrder.newOrderRespType = options.newOrderRespType || 'FULL';

			order = new NewOrder(nOrder);
			return await self._newOrder(order);
		} catch (err) {
			throw err;
		}
	}

	constructor(options: IBinanceOptions) {
		super(options);
	}
}