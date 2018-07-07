import {Auth} from "./Account/Auth";
import {IBinanceOptions} from "./Binance/Interfaces/IBinanceOptions";
import {Binance} from "./Binance/Binance";

export class Bot {
	public static binance: Binance = new Binance();

	public static init(options: IBinanceOptions): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await Bot.binance.initialize(options);
				resolve();
			} catch (err) {
				reject()
			}
		});
	}

	constructor() {
	}
}

let opts: IBinanceOptions = <IBinanceOptions>{};
let auth:Auth = new Auth();
auth.key = "L0FS9RPqvB8prFcE1hQCTiowHYpWdq16X1eyFZURGOOjdnz1LfE5fbquf7qUQQgK";
auth.secret = "ANyASMoj6iMAYjvpgcVNLWvEToDBj6bco8NTqKJqzvml2vp4zHSKwajpqU2hSBiy";
opts.auth = auth;
opts.test = true;
opts.useServerTime;

Bot.init(opts).then(async success => {
	Bot.binance.websocket.candles(["BTCUSDT"], ["1m"], (candle) => {
		console.log(candle);
	});
});


