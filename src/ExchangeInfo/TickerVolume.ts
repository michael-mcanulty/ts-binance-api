import {I24hrTickerResponse} from "./Interfaces/I24hrTickerResponse";

export class TickerVolume {
	symbol: string;
	volume: number;

	public static toTickerVolumeList(tickers: I24hrTickerResponse[]):TickerVolume[]{
		return tickers.map(ticker=>new TickerVolume(ticker));
	}
	constructor(ticker: I24hrTickerResponse) {
		this.symbol = ticker.symbol;
		this.volume = parseFloat(ticker.volume);
	}
}