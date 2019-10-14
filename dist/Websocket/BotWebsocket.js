"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReconnectingWebSocket_1 = require("./ReconnectingWebSocket/ReconnectingWebSocket");
const ticker_1 = require("../ExchangeInfo/ticker");
const Rest_1 = require("../Rest/Rest");
const Candle_1 = require("../ExchangeInfo/Candle");
const ExecutionReport_1 = require("../Account/ExecutionReport");
const OutboundAccountInfo_1 = require("../Account/OutboundAccountInfo");
class BotWebsocket extends Rest_1.Rest {
    constructor(options) {
        super(options);
        this._reconOptions = {};
        this._reconOptions = {};
        this._reconOptions.connectionTimeout = 4E3;
        this._reconOptions.constructor = BotWebsocket;
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
        const self = this;
        const keepStreamAlive = (method, listenKey) => async () => await method.apply(this, { listenKey });
        self.getDataStream().then(async (lk) => {
            const listenKey = lk.listenKey;
            const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
            w.onmessage = (msg) => {
                let json = JSON.parse(msg.data);
                if (json.e === "outboundAccountInfo") {
                    let infoRaw;
                    infoRaw = json;
                    let accountInfo = OutboundAccountInfo_1.OutboundAccountInfo.fromBinanceStream(infoRaw);
                    callback(accountInfo.balances);
                }
            };
            const int = setInterval(keepStreamAlive(self.keepDataStream, listenKey), 50e3);
            keepStreamAlive(self.keepDataStream, listenKey)();
            return async () => {
                clearInterval(int);
                await self.closeDataStream();
                w.close(1000, 'Close handle was called');
            };
        });
    }
    candles(symbols, intervals, callback) {
        const symbolCache = symbols.map(symbol => {
            return intervals.map(interval => {
                let w = this.openWebSocket(`${BotWebsocket.BASE}/${symbol.toLowerCase()}@kline_${interval}`);
                w.onmessage = async (msg) => {
                    let klineRes;
                    klineRes = JSON.parse(msg.data);
                    let candle;
                    if (klineRes.k.x) {
                        candle = Candle_1.Candle.fromWebsocket(klineRes);
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
            this._ws = new ReconnectingWebSocket_1.default(this.url, this._reconOptions);
            return this._ws;
        }
    }
    orders(callback) {
        const self = this;
        const keepStreamAlive = (method, listenKey) => async () => await method.apply(this, { listenKey });
        self.getDataStream().then(async (lk) => {
            const listenKey = lk.listenKey;
            const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
            w.onmessage = (msg) => {
                let json = JSON.parse(msg.data);
                if (json.e === "executionReport") {
                    let reportRaw;
                    reportRaw = json;
                    let executionReport = ExecutionReport_1.ExecutionReport.fromBinanceStream(reportRaw);
                    callback(executionReport);
                }
            };
            const int = setInterval(keepStreamAlive(self.keepDataStream, listenKey), 50e3);
            keepStreamAlive(self.keepDataStream, listenKey)();
            return async () => {
                clearInterval(int);
                await self.closeDataStream();
                w.close(1000, 'Close handle was called');
            };
        });
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
    user(callback) {
        const self = this;
        const keepStreamAlive = (method, listenKey) => async () => await method.call(this, { listenKey });
        self.getDataStream().then(async (lk) => {
            const listenKey = lk.listenKey;
            const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
            w.onmessage = (msg) => {
                let json = JSON.parse(msg.data);
                if (json.e === "executionReport") {
                    let reportRaw;
                    reportRaw = json;
                    let executionReport = ExecutionReport_1.ExecutionReport.fromBinanceStream(reportRaw);
                    callback(executionReport);
                }
                else if (json.e === "outboundAccountInfo") {
                    let infoRaw;
                    infoRaw = json;
                    let accountInfo = OutboundAccountInfo_1.OutboundAccountInfo.fromBinanceStream(infoRaw);
                    callback(accountInfo);
                }
            };
            const int = setInterval(keepStreamAlive(self.keepDataStream, listenKey), 50e3);
            keepStreamAlive(self.keepDataStream, listenKey)();
            return async () => {
                clearInterval(int);
                await self.closeDataStream();
                w.close(1000, 'Close handle was called');
            };
        });
    }
}
BotWebsocket.BASE = 'wss://stream.binance.us:9443/ws';
exports.BotWebsocket = BotWebsocket;
//# sourceMappingURL=BotWebsocket.js.map