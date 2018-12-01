import {I24hrTickerResponse} from "./Interfaces/I24hrTickerResponse";

export class Ticker24hr {
	askPrice: number;
	bidPrice: number;
	closeTime: number;
	count: number;
	firstId: number;
	highPrice: number;
	lastId: number;
	lastPrice: number;
	lastQty: number;
	lowPrice: number;
	openPrice: number;
	openTime: number;
	prevClosePrice: number;
	priceChange: number;
	priceChangePercent: number;
	quoteVolume: number;
	symbol: string;
	volume: number;
	weightedAvgPrice: number;

	constructor(ticker: I24hrTickerResponse) {
		this.askPrice = parseFloat(ticker.askPrice);
		this.bidPrice = parseFloat(ticker.bidPrice);
		this.closeTime = ticker.closeTime;
		this.count = ticker.count;
		this.firstId = ticker.firstId;
		this.highPrice = parseFloat(ticker.highPrice);
		this.lastId = ticker.lastId;
		this.lastPrice = parseFloat(ticker.lastPrice);
		this.lastQty = parseFloat(ticker.lastQty);
		this.lowPrice = parseFloat(ticker.lowPrice);
		this.openPrice = parseFloat(ticker.openPrice);
		this.openTime = ticker.openTime;
		this.prevClosePrice = parseFloat(ticker.prevClosePrice);
		this.priceChange = parseFloat(ticker.priceChange);
		this.priceChangePercent = parseFloat(ticker.priceChangePercent);
		this.quoteVolume = parseFloat(ticker.quoteVolume);
		this.symbol = ticker.symbol;
		this.volume = parseFloat(ticker.volume);
		this.weightedAvgPrice = parseFloat(ticker.weightedAvgPrice);
	}
}