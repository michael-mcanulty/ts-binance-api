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

	constructor(restCandle: RestCandle, symbol?: string, interval?: string) {
		this.openTime = new Date(restCandle.openTime);
		this.open = parseFloat(restCandle.open);
		this.high = parseFloat(restCandle.high);
		this.low = parseFloat(restCandle.low);
		this.close = parseFloat(restCandle.close);
		this.volume = parseFloat(restCandle.volume);
		this.closeTime = new Date(restCandle.closeTime);
		if (symbol || interval) {
			this.symbol = symbol;
			this.interval = interval;
		}
	}
}
