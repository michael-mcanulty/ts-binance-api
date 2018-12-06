"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RestCandle_1 = require("./RestCandle");
const WSCandle_1 = require("./WSCandle");
class Candle {
    static fromRestStream(rawData, symbol, interval) {
        let restCandles = RestCandle_1.RestCandle.fromRest(rawData);
        return restCandles.map(r => r.toCandle(symbol, interval));
    }
    static fromWebsocket(klineStream) {
        let wsCandleResp = new WSCandle_1.WSCandleResp(klineStream);
        return wsCandleResp.candle.toCandle();
    }
    static fromApiCandle(openTime, open, high, low, close, volume, closeTime, symbol, interval) {
        let _symbol;
        let _interval;
        let _openTime = new Date(openTime);
        let _open = parseFloat(open);
        let _high = parseFloat(high);
        let _low = parseFloat(low);
        let _close = parseFloat(close);
        let _volume = parseFloat(volume);
        let _closeTime = new Date(closeTime);
        if (symbol || interval) {
            _symbol = symbol;
            _interval = interval;
        }
        return new Candle(_openTime, _open, _high, _low, _close, _volume, _closeTime, _symbol, _interval);
    }
    constructor(openTime, open, high, low, close, volume, closeTime, symbol, interval) {
        this.openTime = new Date(openTime);
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.closeTime = new Date(closeTime);
        if (symbol || interval) {
            this.symbol = symbol;
            this.interval = interval;
        }
    }
}
exports.Candle = Candle;
//# sourceMappingURL=Candle.js.map