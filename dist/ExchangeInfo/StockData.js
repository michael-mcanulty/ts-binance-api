"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
class StockData {
	constructor(open, high, low, close, reversedInput) {
		this.open = open;
		this.high = high;
		this.low = low;
		this.close = close;
		this.reversedInput = reversedInput;
	}
}
exports.StockData = StockData;
class CandleData {
}
exports.CandleData = CandleData;
class CandleList {
	constructor() {
		this.close = [];
		this.high = [];
		this.low = [];
		this.open = [];
		this.timestamp = [];
		this.volume = [];
	}

	static toCandleList(candles) {
		let candleList = candles.map(x => x.close);
		let cList = new CandleList();
		candles.forEach((item, i) => {
			cList.open.push(candles[i].open);
			cList.high.push(candles[i].high);
			cList.low.push(candles[i].low);
			cList.close.push(candles[i].close);
		});
		return cList;
	}
}
exports.CandleList = CandleList;
//# sourceMappingURL=StockData.js.map