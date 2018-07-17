"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Binance_1 = require("../Binance/Binance");

class Interval {
	constructor(interval) {
		this.interval = interval;
		this.msInterval = Binance_1.Binance.intervalToMilliseconds[interval];
		this.index = Binance_1.Binance.INTERVALS.indexOf(this.interval);
	}
}

exports.Interval = Interval;
//# sourceMappingURL=IndicatorInterval.js.map