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
const BinanceRest_1 = require("../Rest/BinanceRest");
const HttpError_1 = require("../Error/HttpError");

class WSBinance extends BinanceRest_1.BinanceRest {
    constructor(options) {
        super(options);
        this._reconOptions = {};
        this.base = 'wss://stream.binance.com:9443/ws';
        this.isAlive = false;
        this.options = options;
        this._reconOptions = {};
        this._reconOptions.connectionTimeout = 4E3;
			this._reconOptions.constructor = typeof window !== 'undefined' ? WSBinance : Html5WebSocket;
        this._reconOptions.debug = false;
        this._reconOptions.maxReconnectionDelay = 10E3;
        this._reconOptions.maxRetries = Infinity;
        this._reconOptions.minReconnectionDelay = 4E3;
        this.heartbeat();
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
    cache(payload) {
        return Array.isArray(payload) ? payload : [payload];
    }
    getPrices(cb) {
        let ticksToPrices = (tickers) => {
            let prices = tickers.map(t => {
                return t.toPrice();
            });
            cb(prices);
        };
        this.getTickers(ticksToPrices);
    }
    getTickers(cb) {
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
			return (options) => this._cache.forEach(w => w.close(1000, 'Close handle was called'));
    }
    getUser() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const keepStreamAlive = (method, listenKey) => () => method({ listenKey });
            this.user = (cb) => __awaiter(this, void 0, void 0, function* () {
                this.listenKey = yield this.getDataStream();
                const w = this.openWebSocket(`${this.base}/${this.listenKey}`);
                w.onmessage = (msg) => (this.userEventHandler(cb)(msg));
                const int = setInterval(keepStreamAlive(this.keepDataStream, this.listenKey), 50e3);
                keepStreamAlive(this.keepDataStream, this.listenKey)();
							let result = () => __awaiter(this, void 0, void 0, function* () {
                    clearInterval(int);
                    yield this.closeDataStream();
								w.close(1000, 'Close handle was called');
                });
                resolve(result);
            });
        }));
    }
    heartbeat() {
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                this.isAlive = yield this.ping();
            }
            catch (err) {
							let error = new HttpError_1.HttpError({msg: 'DISCONNECTED', code: -1001});
							this._ws.close(error.code, error.message);
            }
        }), 3000);
    }
    openWebSocket(url) {
        if (url) {
            this.url = url;
            this._ws = new ReconnectingWebSocket_1.default(this.url, undefined, this._reconOptions);
            return this._ws;
        }
    }
}

exports.WSBinance = WSBinance;
//# sourceMappingURL=WsBinance.js.map