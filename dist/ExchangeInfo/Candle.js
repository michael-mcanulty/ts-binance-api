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
    constructor(restCandle, symbol, interval) {
        this.openTime = new Date(restCandle.openTime);
        this.open = parseFloat(restCandle.open);
        this.high = parseFloat(restCandle.high);
        this.low = parseFloat(restCandle.low);
        this.close = parseFloat(restCandle.close);
        this.volume = parseFloat(restCandle.volume);
        this.closeTime = new Date(restCandle.closeTime);
        if (symbol || interval) {
            this.symbol = symbol;
            this.interval = interval;
        }
    }
}
exports.Candle = Candle;
//# sourceMappingURL=Candle.js.map