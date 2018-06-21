import {CandleList} from "./StockData";

export class Candle {
	close: number;
	date: Date;
	high: number;
	low: number;
	open: number;
	period?: string;
	symbol?: string;
	volume: number;

	static fromCandleList(candleList: CandleList, symbol: string, interval: string): Candle[] {
		let candles: Candle[] = [];
		candleList.close.forEach((close, i) => {
			let candle: Candle = new Candle(candleList.timestamp[i], candleList.open[i].toString(), candleList.high[i].toString(), candleList.low[i].toString(), candleList.close[i].toString(), candleList.volume[i].toString(), symbol, interval);
			candles.push(candle);
		});

		return candles;
	}

	constructor(date: number, open: string, high: string, low: string, close: string, volume: string, symbol?: string, period?: string, advanceDecline?: string) {
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
}
