"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interval_1 = require("./Interval");
const Binance_1 = require("../Binance/Binance");
class CandleInterval {
    constructor(candles) {
        this.candles = candles;
        this.interval = this.candles[0].interval;
        this.symbol = this.candles[0].symbol;
        this.lastUpdated = candles[candles.length - 1].openTime;
        this.nextUpdate = this.lastUpdated.getTime() + Binance_1.Binance.intervalToMilliseconds[this.interval];
        this._interval = new Interval_1.Interval(this.interval);
    }
}
exports.CandleInterval = CandleInterval;
//# sourceMappingURL=CandleInterval.js.map