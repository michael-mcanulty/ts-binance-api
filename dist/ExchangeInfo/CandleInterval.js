"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const IndicatorInterval_1 = require("./IndicatorInterval");
const Binance_1 = require("../Binance/Binance");

class CandleInterval {
	constructor(candles) {
		this.candles = candles;
		this.interval = this.candles[0].interval;
		this.symbol = this.candles[0].symbol;
		this.lastUpdated = candles[candles.length - 1].date;
		this.nextUpdate = this.lastUpdated.getTime() + Binance_1.Binance.intervalToMilliseconds[this.interval];
		this._interval = new IndicatorInterval_1.Interval(this.interval);
	}
}

exports.CandleInterval = CandleInterval;
//# sourceMappingURL=CandleInterval.js.map