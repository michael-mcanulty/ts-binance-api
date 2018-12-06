import {RestCandle} from "./RestCandle";
import {IStreamRawKlineResponse} from "../ExchangeInfo/Interfaces/ICandleBinance";
import {WSCandleResp} from "./WSCandle";

export class Candle {
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

	static fromApiCandle(openTime: number, open: string, high: string, low: string, close: string, volume: string, closeTime: number, symbol?: string, interval?: string){
		let _symbol: string;
		let _interval: string;
		let _openTime: Date = new Date(openTime);
		let _open: number = parseFloat(open);
		let _high: number = parseFloat(high);
		let _low: number = parseFloat(low);
		let _close: number = parseFloat(close);
		let _volume: number = parseFloat(volume);
		let _closeTime: Date = new Date(closeTime);
		if (symbol || interval) {
			_symbol = symbol;
			_interval = interval;
		}

		return new Candle(_openTime, _open, _high, _low, _close, _volume, _closeTime, _symbol, _interval);
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
