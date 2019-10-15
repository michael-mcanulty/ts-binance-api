import {RestCandle} from "./RestCandle";
import {IStreamRawKlineResponse} from "../ExchangeInfo/Interfaces/ICandleBinance";
import {WSCandleResp} from "./WSCandle";
import {ICandle} from "./Interfaces/ICandle";

export class Candle implements ICandle{
	close: number;
	openTime: Date;
	high: number;
	interval?: string;
	low: number;
	open: number;
	symbol?: string;
	volume: number;
	closeTime: Date;

	static fromRestStream(rawData: any[][], symbol: string, interval: string): Candle[] {
		let restCandles: RestCandle[] = RestCandle.fromRest(rawData);
		return restCandles.map(r=>r.toCandle(symbol, interval));
	}

	static fromWebsocket(klineStream: IStreamRawKlineResponse): Candle{
		let wsCandleResp: WSCandleResp = new WSCandleResp(klineStream);
		return wsCandleResp.candle.toCandle();
	}
	
	constructor(openTime: Date, open: number, high: number, low: number, close: number, volume: number, closeTime: Date, symbol?: string, interval?: string) {
		this.openTime = new Date(openTime);
		this.open = open;
		this.high = high;
		this.low = low;
		this.close = close;
		this.volume = volume;
		this.closeTime = new Date(closeTime);

		if (symbol || interval) {
			this.symbol = symbol;
			this.interval = interval;
		}
	}
}
