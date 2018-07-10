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
				let raw = yield this.call('/v1/klines', candleOpts);
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

	closeDataStream() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			try {
				let callOpts = {};
				callOpts.method = EMethod_1.EMethod.DELETE;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = yield this.privateCall('/v1/userDataStream', Rest.listenKey, callOpts);
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

	getMarkets(quoteAsset) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let info = yield this.getExchangeInfo();
				let symbols = info.symbols;
				let markets = symbols.map(symbol => {
					return new Market_1.Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market_1.Market.GetLimitsFromBinanceSymbol(symbol));
				});
				resolve(markets);
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

	getDataStream() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let callOpts = {};
				callOpts.method = EMethod_1.EMethod.POST;
				callOpts.noData = true;
				callOpts.noExtra = false;
				Rest.listenKey = (yield this.privateCall('/v1/userDataStream', null, callOpts));
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
				let opts = {};
				opts.noData = true;
				opts.headers = new Headers();
				opts.method = EMethod_1.EMethod.GET;
				opts.json = true;
				let info = yield this.call('/v1/exchangeInfo', null, opts);
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
				let callOpts = {};
				callOpts.method = EMethod_1.EMethod.PUT;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = yield this.privateCall('/v1/userDataStream', Rest.listenKey, callOpts);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map