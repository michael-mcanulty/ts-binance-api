import {Binance} from "../Binance/Binance";

export class Interval {
	index: number;
	interval: string;
	msInterval: number;

	constructor(interval: string) {
		this.interval = interval;
		this.msInterval = Binance.intervalToMilliseconds[interval];
		this.index = Binance.INTERVALS.indexOf(this.interval);
	}
}