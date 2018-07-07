import {CandleList} from "./StockData";
import {IStreamRawKline, IStreamRawKlineResponse} from "./Interfaces/ICandleBinance";

export class Candle {
	close: number;
	date: Date;
	high: number;
	interval?: string;
	low: number;
	open: number;
	quoteAsset?: string;
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

	static fromHttpByInterval(rawData: any[][], symbol: string, interval: string, quoteAssetName?: string): Candle[] {
		return rawData.map(candle => {
			return new Candle(candle[0], candle[1], candle[2], candle[3], candle[4], candle[5], symbol, interval, quoteAssetName);
		});
	}

	static fromStream(rawKlineResponse: IStreamRawKlineResponse): Candle {
		let rawKline: IStreamRawKline = rawKlineResponse.k;
		return new Candle(rawKline.T, rawKline.o, rawKline.h, rawKline.l, rawKline.c, rawKline.v, rawKline.s, rawKline.i);
	}

	constructor(date: number, open: string, high: string, low: string, close: string, volume: string, symbol?: string, interval?: string, quoteAssetName?: string) {
		this.date = new Date(new Date(date).setSeconds(0, 0));
		this.open = parseFloat(open);
		this.high = parseFloat(high);
		this.low = parseFloat(low);
		this.close = parseFloat(close);
		this.volume = parseFloat(volume);
		if (symbol || interval || quoteAssetName) {
			this.symbol = symbol;
			this.interval = interval;
			this.quoteAsset = quoteAssetName;
		}
	}
}
