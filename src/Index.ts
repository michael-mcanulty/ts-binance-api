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
auth.key = "S05wQBtvZ8LmuAkqiDMXWKvJI1SBeR9H6kE9poWQVeA6MLGp508h7gLX0Wce92u6";
auth.secret = "iDCk1PtTyucLSlj5wRYIeSrphteLX2ESRONkcsxjhbg2PubidzGps34bKw98tm2D";
opts.auth = auth;
opts.test = true;
opts.useServerTime = true;

Bot.init(opts).then(async success => {
	await Bot.binance.websocket.balances(res => {
		console.log(res);
	});
});

