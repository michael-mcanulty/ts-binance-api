import {Rest} from "../Rest/Rest";
import {BotWebsocket} from "../Websocket/BotWebsocket";
import {IBinanceOptions} from "./Interfaces/IBinanceOptions";
import {Market} from "../Market/Market";

export class Binance {
	public static INTERVALS: string[] = ['1m', '3m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w'];
	public static candleAPILimits = {
		'1m': 1000,
		'3m': 1000,
		'5m': 1000,
		'15m': 1000,
		'30m': 1000,
		'1h': 1000,
		'2h': 744,
		'4h': 373,
		'6h': 248,
		'8h': 187,
		'12h': 187,
		'1d': 63,
		'3d': 21,
		'1w': 9,
	};
	public static intervalDays: any = {
		'1m': 6,
		'3m': 3,
		'5m': 8,
		'15m': 20,
		'30m': 30,
		'1h': 55,
		'2h': 100,
		'4h': 200,
		'6h': 350,
		'8h': 400,
		'12h': 500,
		'1d': 1000,
		'3d': 333,
		'1w': 56
	};
	public static intervalToMilliseconds: any = {
		'1m': 60000,
		'3m': 60000 * 3,
		'5m': 60000 * 5,
		'15m': 60000 * 15,
		'30m': 60000 * 30,
		'1h': 3600000,
		'2h': 3600000 * 2,
		'4h': 3600000 * 4,
		'6h': 3600000 * 6,
		'8h': 3600000 * 8,
		'12h': 3600000 * 12,
		'1d': 3600000 * 24,
		'3d': 3600000 * 24 * 3,
		'1w': 3600000 * 24 * 7
	};
	public static intervalToMinutes: any = {
		'1m': 1,
		'3m': 3,
		'5m': 5,
		'15m': 15,
		'30m': 30,
		'1h': 60,
		'2h': 60 * 2,
		'4h': 60 * 4,
		'6h': 60 * 6,
		'8h': 60 * 8,
		'12h': 60 * 12,
		'1d': 60 * 24,
		'3d': 60 * 24 * 3,
		'1w': 60 * 24 * 7,
	};
	public static minutesToInterval: any = {
		1: '1m',
		3: '3m',
		5: '5m',
		15: '15m',
		30: '30m',
		60: '1h',
		120: '2h',
		240: '4h',
		360: '6h',
		480: '8h',
		720: '12h',
		1440: '1d',
		4320: '3d',
		10080: '1w'
	};
	public static markets: Market[];
	public static options: IBinanceOptions;
	public rest: Rest;
	public websocket: BotWebsocket;

	public init() {
		return new Promise(async (resolve, reject) => {
			try {
				Binance.markets = await this.rest.getMarkets();
				resolve(Binance.markets);
			} catch (err) {
				reject(err);
			}
		});
	}

	constructor(options: IBinanceOptions) {
		this.rest = new Rest(options);
		this.websocket = new BotWebsocket(options);
	}
}