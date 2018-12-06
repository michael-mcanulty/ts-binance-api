"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RestCandle_1 = require("./RestCandle");
class WSCandle extends RestCandle_1.RestCandle {
    constructor(candle) {
        super(candle.t, candle.o, candle.h, candle.l, candle.c, candle.v, candle.T, candle.q, candle.n, candle.V, candle.Q, candle.B);
        this.symbol = candle.s;
        this.interval = candle.i;
    }
}
exports.WSCandle = WSCandle;
class WebSocketCandle {
    constructor(klineWs) {
        let kline = klineWs.k;
        this.eventType = klineWs.e;
        this.eventTime = klineWs.E;
        this.symbol = klineWs.s;
        this.candle = new WSCandle(kline);
    }
}
//# sourceMappingURL=WebSocketCandle.js.map