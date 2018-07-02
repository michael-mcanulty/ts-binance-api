"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
class Candle {
	constructor(date, open, high, low, close, volume, symbol, period, advanceDecline) {
		this.date = new Date(new Date(date).setSeconds(0, 0));
		this.open = parseFloat(open);
		this.high = parseFloat(high);
		this.low = parseFloat(low);
		this.close = parseFloat(close);
		this.volume = parseFloat(volume);
		if (symbol) {
			this.symbol = symbol;
			this.period = period;
		}
	}

	static fromCandleList(candleList, symbol, interval) {
		let candles = [];
		candleList.close.forEach((close, i) => {
			let candle = new Candle(candleList.timestamp[i], candleList.open[i].toString(), candleList.high[i].toString(), candleList.low[i].toString(), candleList.close[i].toString(), candleList.volume[i].toString(), symbol, interval);
			candles.push(candle);
		});
		return candles;
	}
}
exports.Candle = Candle;
//# sourceMappingURL=Candle.js.map