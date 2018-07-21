import {Price} from "../Transaction/Price";
import {IStreamTicker, IStreamTickerRaw} from "./Interfaces/IStreamTickerRaw";

export class Ticker implements IStreamTicker {
	bestAsk: string;
	bestAskQnt: string;
	bestBid: string;
	bestBidQnt: string;
	closeTime: number;
	closeTradeQuantity: string;
	curDayClose: string;
	eventTime: number;
	eventType: string;
	firstTradeId: number;
	high: string;
	lastTradeId: number;
	low: string;
	open: string;
	openTime: number;
	prevDayClose: string;
	priceChange: string;
	priceChangePercent: string;
	symbol: string;
	totalTrades: number;
	volume: string;
	volumeQuote: string;
	weightedAvg: string;

	public toPrice():Price{
		return new Price(this.symbol, this.curDayClose);
	}

	constructor(rawStreamTicker: IStreamTickerRaw) {
		let m = rawStreamTicker;
		let ticker: IStreamTicker = {
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
}