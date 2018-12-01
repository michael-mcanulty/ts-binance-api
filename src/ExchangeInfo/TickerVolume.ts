import {I24hrTickerResponse} from "./Interfaces/I24hrTickerResponse";

export class TickerVolume {
	symbol: string;
	volume: number;

	constructor(ticker: I24hrTickerResponse) {
		this.symbol = ticker.symbol;
		this.volume = parseFloat(ticker.volume);
	}
}