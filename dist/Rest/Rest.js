"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	return new (P || (P = Promise))(function (resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}

		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}

		function step(result) {
			result.done ? resolve(result.value) : new P(function (resolve) {
				resolve(result.value);
			}).then(fulfilled, rejected);
		}

		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
Object.defineProperty(exports, "__esModule", {value: true});
const BotHttp_1 = require("./BotHttp");
const EMethod_1 = require("./EMethod");
const CandleInterval_1 = require("../ExchangeInfo/CandleInterval");
const Candle_1 = require("../ExchangeInfo/Candle");
const Market_1 = require("../Market/Market");
const Binance_1 = require("../Binance/Binance");
const Index_1 = require("../Index");
const NewOrder_1 = require("../Transaction/NewOrder");
const EOrderEnums_1 = require("../Transaction/Interfaces/EOrderEnums");
const Order_1 = require("../Transaction/Order");
const HttpError_1 = require("../Error/HttpError");
const Signed_1 = require("./Signed");
const DataStream_1 = require("./DataStream");
const CallOptions_1 = require("./CallOptions");
class Rest extends BotHttp_1.BotHttp {
	constructor(options) {
		super(options);
	}

	_getCandlesInterval(symbol, interval, limit) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let candleOpts = {};
				candleOpts.symbol = symbol;
				candleOpts.interval = interval;
				candleOpts.limit = limit;
				let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET);
				let raw = yield this.call('/v1/klines', callOpts, candleOpts);
				let candles = Candle_1.Candle.fromHttpByInterval(raw, candleOpts.symbol, candleOpts.interval);
				candles.forEach((candle) => {
					candle.quoteAsset = Index_1.Bot.binance.rest.getQuoteAssetName(symbol);
				});
				resolve(candles);
			}
			catch (err) {
				reject(err);
			}
		}));
	}
	;

	cancelOrder(cancelOrder) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let orderRes;
				let privateOrder;
				let url = (Binance_1.Binance.options.test) ? "/v3/order/test" : "/v3/order";
				let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.DELETE, true, false, false);
				privateOrder = yield this.privateCall(url, callOpts, cancelOrder);
				if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
					resolve(privateOrder);
				}
				else {
					if (privateOrder instanceof HttpError_1.HttpError) {
						reject(privateOrder);
					}
					else {
						orderRes = privateOrder;
						resolve(orderRes);
					}
				}
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	closeDataStream() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			try {
				let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.DELETE, true, false, true);
				let dStream = new DataStream_1.DataStream(Rest.listenKey);
				result = yield this.privateCall('/v1/userDataStream', callOpts, dStream);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	getCandles(symbols, intervals, limit) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let candleIntervals = [];
				for (let symbol of symbols) {
					for (let interval of intervals) {
						let candles = yield this._getCandlesInterval(symbol, interval, limit);
						let ci = new CandleInterval_1.CandleInterval(candles);
						candleIntervals.push(ci);
					}
				}
				resolve(candleIntervals);
			}
			catch (err) {
				reject(err);
			}
		}));
	}
	;

	getDataStream() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.POST, true, true, false);
				let signed = new Signed_1.Signed();
				Rest.listenKey = (yield this.privateCall('/v1/userDataStream', callOpts, signed));
				resolve(Rest.listenKey);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	getExchangeInfo() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
				let info = yield this.call('/v1/exchangeInfo', callOpts);
				resolve(info);
			}
			catch (err) {
				reject(err);
			}
		}));
	}
	;

	keepDataStream() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			try {
				let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.PUT, true, false, true);
				let dStream = new DataStream_1.DataStream(Rest.listenKey);
				result = yield this.privateCall('/v1/userDataStream', callOpts, dStream);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	getQuoteAssetName(symbol) {
		let qa;
		let marketFilter = Binance_1.Binance.markets.filter(market => market.symbol === symbol);
		let market;
		if (marketFilter && marketFilter.length > 0) {
			market = marketFilter[0];
			qa = market.quoteAsset;
		}
		return qa;
	}

	marketBuy(symbol, quantity) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let type = EOrderEnums_1.EOrderType.MARKET;
				let side = EOrderEnums_1.EOrderSide.BUY;
				let order = new NewOrder_1.NewOrder(quantity, side, symbol, type);
				let orderRes = yield this.newOrder(order);
				resolve(orderRes);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	getMarkets(quoteAsset) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let info = yield this.getExchangeInfo();
				let symbols = info.symbols;
				let markets = symbols.map(symbol => {
					return new Market_1.Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market_1.Market.GetLimitsFromBinanceSymbol(symbol));
				});
				Binance_1.Binance.markets = markets;
				resolve(markets);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	marketSell(symbol, quantity) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let type = EOrderEnums_1.EOrderType.MARKET;
				let side = EOrderEnums_1.EOrderSide.SELL;
				let newOrder = new NewOrder_1.NewOrder(quantity, side, symbol, type);
				resolve(newOrder);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	newOrder(order) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let orderRes;
				let privateOrder;
				let url = (Binance_1.Binance.options.test) ? "/v3/order/test" : "/v3/order";
				let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.POST, true, false, false);
				privateOrder = yield this.privateCall(url, callOpts, order);
				if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
					resolve(privateOrder);
				}
				else {
					if (privateOrder instanceof HttpError_1.HttpError) {
						reject(privateOrder);
					}
					else {
						orderRes = new Order_1.Order(privateOrder);
						resolve(orderRes);
					}
				}
			}
			catch (err) {
				reject(err);
			}
		}));
	}
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map