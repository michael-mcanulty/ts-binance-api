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

	constructor(openTime: number, open: string, high: string, low: string, close: string, volume: string, closeTime: number, symbol?: string, interval?: string) {
		this.openTime = new Date(openTime);
		this.open = parseFloat(open);
		this.high = parseFloat(high);
		this.low = parseFloat(low);
		this.close = parseFloat(close);
		this.volume = parseFloat(volume);
		this.closeTime = new Date(closeTime);
		if (symbol || interval) {
			this.symbol = symbol;
			this.interval = interval;
		}
	}
}
