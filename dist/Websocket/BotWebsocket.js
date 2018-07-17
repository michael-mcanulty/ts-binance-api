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
const Html5WebSocket = require("html5-websocket");
const ReconnectingWebSocket_1 = require("./ReconnectingWebSocket/ReconnectingWebSocket");
const ticker_1 = require("../ExchangeInfo/ticker");
const Rest_1 = require("../Rest/Rest");
const HttpError_1 = require("../Error/HttpError");
const Candle_1 = require("../ExchangeInfo/Candle");
const OutboundAccountInfo_1 = require("../Account/OutboundAccountInfo");
const ExecutionReport_1 = require("../Account/ExecutionReport");

class BotWebsocket extends Rest_1.Rest {
	constructor(options) {
		super(options);
		this._reconOptions = {};
		this.options = options;
		this._reconOptions = {};
		this._reconOptions.connectionTimeout = 4E3;
		this._reconOptions.constructor = typeof window !== 'undefined' ? BotWebsocket : Html5WebSocket;
		this._reconOptions.debug = false;
		this._reconOptions.maxReconnectionDelay = 10E3;
		this._reconOptions.maxRetries = Infinity;
		this._reconOptions.minReconnectionDelay = 4E3;
	}

	static get Instance() {
		return this._INSTANCE;
	}

	get url() {
		return this._url;
	}

	set url(value) {
		this._url = value;
	}

	static heartbeat() {
		setInterval(() => __awaiter(this, void 0, void 0, function* () {
			try {
				this.isAlive = yield BotWebsocket.Instance.ping();
			}
			catch (err) {
				let error = new HttpError_1.HttpError({msg: 'DISCONNECTED', code: -1001});
				BotWebsocket._ws.close(error.code, error.message);
			}
		}), 3000);
	}

	_getTickerUrl(symbol) {
		if (symbol && symbol !== null) {
			return `${BotWebsocket.BASE}/${symbol.toLowerCase()}@ticker`;
		}
		else {
			return `${BotWebsocket.BASE}/!ticker@arr`;
		}
	}

	_getTickers(callback) {
		let tickers;
		let w = this.openWebSocket(this._getTickerUrl(null));
		w.onmessage = msg => {
			let res;
			res = JSON.parse(msg.data);
			tickers = res.map((raw) => {
				return new ticker_1.Ticker(raw);
			});
			callback(tickers);
		};
		return (options) => w.close(1000, 'Close handle was called');
	}

	balances(callback) {
		const keepStreamAlive = (method, listenKey) => () => __awaiter(this, void 0, void 0, function* () {
			return yield method.call(this, {listenKey});
		});
		this.getDataStream().then((lk) => __awaiter(this, void 0, void 0, function* () {
			const listenKey = lk.listenKey;
			const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
			w.onmessage = (msg) => {
				let json = JSON.parse(msg.data);
				if (json.e === "outboundAccountInfo") {
					let infoRaw;
					infoRaw = json;
					let accountInfo = OutboundAccountInfo_1.OutboundAccountInfo.fromBinanceApi(infoRaw);
					callback(accountInfo);
				}
			};
			const int = setInterval(keepStreamAlive(this.keepDataStream, listenKey), 50e3);
			keepStreamAlive(this.keepDataStream, listenKey)();
			return () => __awaiter(this, void 0, void 0, function* () {
				clearInterval(int);
				yield this.closeDataStream();
				w.close(1000, 'Close handle was called');
			});
		}));
	}

	orders(callback) {
		const keepStreamAlive = (method, listenKey) => () => __awaiter(this, void 0, void 0, function* () {
			return yield method.call(this, {listenKey});
		});
		this.getDataStream().then((lk) => __awaiter(this, void 0, void 0, function* () {
			const listenKey = lk.listenKey;
			const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
			w.onmessage = (msg) => {
				let json = JSON.parse(msg.data);
				if (json.e === "executionReport") {
					let reportRaw;
					reportRaw = json;
					let executionReport = ExecutionReport_1.ExecutionReport.fromBinanceApi(reportRaw);
					callback(executionReport);
				}
			};
			const int = setInterval(keepStreamAlive(this.keepDataStream, listenKey), 50e3);
			keepStreamAlive(this.keepDataStream, listenKey)();
			return () => __awaiter(this, void 0, void 0, function* () {
				clearInterval(int);
				yield this.closeDataStream();
				w.close(1000, 'Close handle was called');
			});
		}));
	}

	user(callback) {
		const keepStreamAlive = (method, listenKey) => () => __awaiter(this, void 0, void 0, function* () {
			return yield method.call(this, {listenKey});
		});
		this.getDataStream().then((lk) => __awaiter(this, void 0, void 0, function* () {
			const listenKey = lk.listenKey;
			const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
			w.onmessage = (msg) => {
				let json = JSON.parse(msg.data);
				if (json.e === "executionReport") {
					let reportRaw;
					reportRaw = json;
					let executionReport = ExecutionReport_1.ExecutionReport.fromBinanceApi(reportRaw);
					callback(executionReport);
				}
				else if (json.e === "outboundAccountInfo") {
					let infoRaw;
					infoRaw = json;
					let accountInfo = OutboundAccountInfo_1.OutboundAccountInfo.fromBinanceApi(infoRaw);
					callback(accountInfo);
				}
			};
			const int = setInterval(keepStreamAlive(this.keepDataStream, listenKey), 50e3);
			keepStreamAlive(this.keepDataStream, listenKey)();
			return () => __awaiter(this, void 0, void 0, function* () {
				clearInterval(int);
				yield this.closeDataStream();
				w.close(1000, 'Close handle was called');
			});
		}));
	}

	candles(symbols, intervals, callback) {
		const symbolCache = symbols.map(symbol => {
			return intervals.map(interval => {
				let w = this.openWebSocket(`${BotWebsocket.BASE}/${symbol.toLowerCase()}@kline_${interval}`);
				w.onmessage = msg => {
					let klineRes;
					klineRes = JSON.parse(msg.data);
					let candle;
					let qa = this.getQuoteAssetName(symbol);
					if (klineRes.k.x) {
						candle = Candle_1.Candle.fromStream(klineRes, qa);
						callback(candle);
					}
				};
				return w;
			});
		});
		return (options) => symbolCache.forEach(cache => cache.forEach(w => w.close(1000, 'Close handle was called')));
	}

	openWebSocket(url) {
		if (url) {
			this.url = url;
			BotWebsocket._ws = new ReconnectingWebSocket_1.default(this.url, undefined, this._reconOptions);
			return BotWebsocket._ws;
		}
	}

	prices(callback) {
		let ticksToPrices = (tickers) => {
			let prices = tickers.map(t => {
				return t.toPrice();
			});
			callback(prices);
		};
		this._getTickers(ticksToPrices);
	}
}

BotWebsocket.BASE = 'wss://stream.binance.com:9443/ws';
BotWebsocket.isAlive = false;
exports.BotWebsocket = BotWebsocket;
//# sourceMappingURL=BotWebsocket.js.map