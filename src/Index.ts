import {Auth} from "./Account/Auth";
import {IBinanceOptions} from "./Binance/Interfaces/IBinanceOptions";
import {Binance} from "./Binance/Binance";

export class Bot {
	public static binance: Binance;

	constructor(opts: IBinanceOptions) {
		Binance.options = opts;
		Bot.binance = new Binance(opts);
	}
}

let opts: IBinanceOptions = <IBinanceOptions>{};
let auth:Auth = new Auth();
auth.key = "S05wQBtvZ8LmuAkqiDMXWKvJI1SBeR9H6kE9poWQVeA6MLGp508h7gLX0Wce92u6";
auth.secret = "iDCk1PtTyucLSlj5wRYIeSrphteLX2ESRONkcsxjhbg2PubidzGps34bKw98tm2D";
opts.auth = auth;
opts.test = false;
opts.useServerTime = true;

const bot = new Bot(opts);
Bot.binance.init().then(async markets => {
	try {
		let purch = await Bot.binance.rest.marketBuy("BNBUSDT", 1);
	} catch (err) {
		console.log(err);
	}
});

