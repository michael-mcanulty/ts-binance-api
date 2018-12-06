import {Candle} from "./Candle";

export class RestCandle {
	openTime: number;
	open: string;
	high: string;
	low:string;
	close: string;
	volume: string;
	closeTime?: number;
	qaVolume?: string;
	numTrades?: number;
	takerBuyBAVolume?: string;
	takerBuyQAVolume?: string;
	ignore?: string;

	static fromRest(rawData: any[][]): RestCandle[] {
		return rawData.map(candle => {
			return new RestCandle(candle[0], candle[1], candle[2], candle[3], candle[4], candle[5], candle[6], candle[7], candle[8], candle[9], candle[10], candle[11]);
		});
	}

	toCandle(symbol: string, interval: string): Candle {
		return new Candle(this, symbol, interval);
	}

	constructor(
		openTime: number, open: string, high: string, low: string, close: string, volume: string, closeTime?: number,
		qaVolume?: string, numTrades?: number, takerBuyBAVolume?: string, takerBuyQAVolume?: string, ignore?: string) {
		this.openTime = openTime;
		this.open = open;
		this.high = high;
		this.low = low;
		this.close = close;
		this.volume = volume;
		this.closeTime = closeTime;
		this.qaVolume = qaVolume;
		this.numTrades = numTrades;
		this.takerBuyBAVolume = takerBuyBAVolume;
		this.takerBuyQAVolume = takerBuyQAVolume;
		this.ignore = ignore;
	}
}
