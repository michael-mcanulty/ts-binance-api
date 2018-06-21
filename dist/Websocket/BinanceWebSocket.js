"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Html5WebSocket = require("html5-websocket");
const ReconnectingWebSocket_1 = require("./ReconnectingWebSocket/ReconnectingWebSocket");
class BinanceWebSocket {
    constructor() {
        this.base = 'https://api.binance.com';
        this._options = {};
        this._options = {};
        this._options.connectionTimeout = 4E3;
        this._options.constructor = typeof window !== 'undefined' ? BinanceWebSocket : Html5WebSocket;
        this._options.debug = false;
        this._options.maxReconnectionDelay = 10E3;
        this._options.maxRetries = Infinity;
        this._options.minReconnectionDelay = 4E3;
        this._reconWebSocket = new ReconnectingWebSocket_1.default(this.url, undefined, this._options);
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    tickerUrl(symbol) {
        return `${this.base}/${symbol.toLowerCase()}@ticker`;
    }

    getTicker(payload, cb) {
        let tickerTransform = m => ({
            eventType: m.e,
            eventTime: m.E,
            symbol: m.s,
            priceChange: m.p,
            priceChangePercent: m.P,
            weightedAvg: m.w,
            prevDayClose: m.x,
            curDayClose: m.c,
            closeTradeQuantity: m.Q,
            bestBid: m.b,
            bestBidQnt: m.B,
            bestAsk: m.a,
            bestAskQnt: m.A,
            open: m.o,
            high: m.h,
            low: m.l,
            volume: m.v,
            volumeQuote: m.q,
            openTime: m.O,
            closeTime: m.C,
            firstTradeId: m.F,
            lastTradeId: m.L,
            totalTrades: m.n,
        });
        this.cache = (Array.isArray(payload) ? payload : [payload]).map(symbol => {
            const w = this.openWebSocket(this.tickerUrl(symbol));
            w.onmessage = msg => {
                cb(tickerTransform(JSON.parse(msg.data)));
            };
            return w;
        });
        return (options) => this.cache.forEach(w => w.close(1000, 'Close handle was called', Object.assign({ keepClosed: true }, options)));
    }
    openWebSocket(url) {
        if (url) {
            this.url = url;
            this._reconWebSocket = new ReconnectingWebSocket_1.default(this.url, undefined, this._options);
            return this._reconWebSocket;
        }
    }
}
exports.BinanceWebSocket = BinanceWebSocket;
//# sourceMappingURL=BinanceWebSocket.js.map