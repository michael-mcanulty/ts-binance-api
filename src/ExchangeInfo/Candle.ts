import {IStreamRawKline, IStreamRawKlineResponse} from "./Interfaces/ICandleBinance";

export class Candle {
	close: number;
	date: Date;
	high: number;
	interval?: string;
	low: number;
	open: number;
	symbol?: string;
	volume: number;

	static fromHttpByInterval(rawData: any[][], symbol: string, interval: string): Candle[] {
		return rawData.map(candle => {
			return new Candle(candle[0], candle[1], candle[2], candle[3], candle[4], candle[5], symbol, interval);
		});
	}

	static fromStream(rawKlineResponse: IStreamRawKlineResponse): Candle {
		let rawKline: IStreamRawKline = rawKlineResponse.k;
		return new Candle(rawKline.t, rawKline.o, rawKline.h, rawKline.l, rawKline.c, rawKline.v, rawKline.s, rawKline.i);
	}

	constructor(date: number, open: string, high: string, low: string, close: string, volume: string, symbol?: string, interval?: string) {
		this.date = new Date(new Date(date).setSeconds(0, 0));
		this.open = parseFloat(open);
		this.high = parseFloat(high);
		this.low = parseFloat(low);
		this.close = parseFloat(close);
		this.volume = parseFloat(volume);
		if (symbol || interval) {
			this.symbol = symbol;
			this.interval = interval;
		}
	}
}
