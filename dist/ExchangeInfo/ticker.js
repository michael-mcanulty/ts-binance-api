"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Price_1 = require("../Transaction/Price");

class Ticker {
	constructor(rawStreamTicker) {
		let m = rawStreamTicker;
		let ticker = {
			eventType: m.e,
			eventTime: m.E,
			symbol: m.s,
			priceChange: m.p,
			priceChangePercent: m.P,
			weightedAvg: m.w,
			prevDayClose: m.x,
			curDayClose: m.c,
			closeTradeQuantity: m.Q,
			bestBid: m.b,
			bestBidQnt: m.B,
			bestAsk: m.a,
			bestAskQnt: m.A,
			open: m.o,
			high: m.h,
			low: m.l,
			volume: m.v,
			volumeQuote: m.q,
			openTime: m.O,
			closeTime: m.C,
			firstTradeId: m.F,
			lastTradeId: m.L,
			totalTrades: m.n,
		};
		Object.assign(this, ticker);
	}

	toPrice() {
		return new Price_1.Price(this.symbol, this.curDayClose);
	}
}

exports.Ticker = Ticker;
//# sourceMappingURL=ticker.js.map