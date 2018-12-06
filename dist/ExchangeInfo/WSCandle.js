"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RestCandle_1 = require("./RestCandle");
const Candle_1 = require("./Candle");
class WSCandle extends RestCandle_1.RestCandle {
    toCandle() {
        return new Candle_1.Candle(new Date(this.openTime), parseFloat(this.open), parseFloat(this.high), parseFloat(this.low), parseFloat(this.close), parseFloat(this.volume), new Date(this.closeTime));
    }
    constructor(candle) {
        super(candle.t, candle.o, candle.h, candle.l, candle.c, candle.v, candle.T, candle.q, candle.n, candle.V, candle.Q, candle.B);
        this.symbol = candle.s;
        this.interval = candle.i;
    }
}
exports.WSCandle = WSCandle;
class WSCandleResp {
    constructor(klineWs) {
        let kline = klineWs.k;
        this.eventType = klineWs.e;
        this.eventTime = klineWs.E;
        this.symbol = klineWs.s;
        this.candle = new WSCandle(kline);
    }
}
exports.WSCandleResp = WSCandleResp;
//# sourceMappingURL=WSCandle.js.map