"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Html5WebSocket = require("html5-websocket");
const ReconnectingWebSocket_1 = require("./ReconnectingWebSocket/ReconnectingWebSocket");
const ticker_1 = require("../ExchangeInfo/ticker");
const Rest_1 = require("../Rest/Rest");
const HttpError_1 = require("../Error/HttpError");
const Candle_1 = require("../ExchangeInfo/Candle");

class WSBinance extends Rest_1.Rest {
    constructor(options) {
        super(options);
        this._reconOptions = {};
        this.base = 'wss://stream.binance.com:9443/ws';
        this.options = options;
        this._reconOptions = {};
        this._reconOptions.connectionTimeout = 4E3;
			this._reconOptions.constructor = typeof window !== 'undefined' ? WSBinance : Html5WebSocket;
        this._reconOptions.debug = false;
        this._reconOptions.maxReconnectionDelay = 10E3;
        this._reconOptions.maxRetries = Infinity;
        this._reconOptions.minReconnectionDelay = 4E3;
    }
    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }
    _getTickerUrl(symbol) {
        if (symbol && symbol !== null) {
            return `${this.base}/${symbol.toLowerCase()}@ticker`;
        }
        else {
            return `${this.base}/!ticker@arr`;
        }
    }

	static get Instance() {
		return this._INSTANCE;
	}

	static heartbeat() {
		setInterval(() => __awaiter(this, void 0, void 0, function* () {
			try {
				this.isAlive = yield WSBinance.Instance.ping();
			}
			catch (err) {
				let error = new HttpError_1.HttpError({msg: 'DISCONNECTED', code: -1001});
				WSBinance._ws.close(error.code, error.message);
			}
		}), 3000);
	}

	_getTickers(cb) {
        let tickers;
        let w = this.openWebSocket(this._getTickerUrl(null));
        w.onmessage = msg => {
            let res;
            res = JSON.parse(msg.data);
            tickers = res.map((raw) => {
                return new ticker_1.Ticker(raw);
            });
            cb(tickers);
        };
		return (options) => w.close(1000, 'Close handle was called');
	}

	candles(symbols, intervals, cb) {
		const symbolCache = symbols.map(symbol => {
			return intervals.map(interval => {
				let w = this.openWebSocket(`${this.base}/${symbol.toLowerCase()}@kline_${interval}`);
				w.onmessage = msg => {
					let klineRes;
					klineRes = JSON.parse(msg.data);
					let candle;
					if (klineRes.k.x) {
						candle = Candle_1.Candle.fromStream(klineRes);
						cb(candle);
					}
				};
				return w;
			});
		});
		return (options) => symbolCache.forEach(cache => cache.forEach(w => w.close(1000, 'Close handle was called')));
	}
	;

    getUser() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const keepStreamAlive = (method, listenKey) => () => method({ listenKey });
            this.user = (cb) => __awaiter(this, void 0, void 0, function* () {
							Rest_1.Rest.listenKey = yield this.getDataStream();
							const w = this.openWebSocket(`${this.base}/${Rest_1.Rest.listenKey}`);
                w.onmessage = (msg) => (this.userEventHandler(cb)(msg));
							const int = setInterval(keepStreamAlive(this.keepDataStream, Rest_1.Rest.listenKey), 50e3);
							keepStreamAlive(this.keepDataStream, Rest_1.Rest.listenKey)();
							let result = () => __awaiter(this, void 0, void 0, function* () {
                    clearInterval(int);
                    yield this.closeDataStream();
								w.close(1000, 'Close handle was called');
                });
                resolve(result);
            });
        }));
    }

    openWebSocket(url) {
        if (url) {
            this.url = url;
					WSBinance._ws = new ReconnectingWebSocket_1.default(this.url, undefined, this._reconOptions);
					return WSBinance._ws;
        }
    }

	prices(cb) {
		let ticksToPrices = (tickers) => {
			let prices = tickers.map(t => {
				return t.toPrice();
			});
			cb(prices);
		};
		this._getTickers(ticksToPrices);
	}
}
WSBinance.isAlive = false;
exports.WSBinance = WSBinance;
//# sourceMappingURL=WSBinance.js.map