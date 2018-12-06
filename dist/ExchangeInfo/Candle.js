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
    constructor(openTime, open, high, low, close, volume, closeTime, symbol, interval) {
        this.openTime = new Date(openTime);
        this.open = parseFloat(open);
        this.high = parseFloat(high);
        this.low = parseFloat(low);
        this.close = parseFloat(close);
        this.volume = parseFloat(volume);
        this.closeTime = new Date(closeTime);
        if (symbol || interval) {
            this.symbol = symbol;
            this.interval = interval;
        }
    }
}
exports.Candle = Candle;
//# sourceMappingURL=Candle.js.map