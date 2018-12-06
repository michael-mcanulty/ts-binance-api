import {Candle} from "./Candle";
import {Interval} from "./Interval";
import {Binance} from "../Binance/Binance";

export class CandleInterval {
	_interval: Interval;
	candles: Candle[];
	interval: string;
	lastUpdated: Date;
	nextUpdate: Date;
	symbol: string;

	constructor(candles: Candle[]) {
		this.candles = candles;
		this.interval = this.candles[0].interval;
		this.symbol = this.candles[0].symbol;
		this.lastUpdated = candles[candles.length - 1].openTime;
		this.nextUpdate = this.lastUpdated.getTime() + Binance.intervalToMilliseconds[this.interval];
		this._interval = new Interval(this.interval);
	}
}