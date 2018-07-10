import {Auth} from "./Account/Auth";
import {IBinanceOptions} from "./Binance/Interfaces/IBinanceOptions";
import {Binance} from "./Binance/Binance";
import {Order} from "./Transaction/Order";

export class Bot {
	public static binance: Binance = new Binance();
	public options: IBinanceOptions = <IBinanceOptions>{};

	constructor(opts: IBinanceOptions) {
		this.options = opts;
	}
}

let opts: IBinanceOptions = <IBinanceOptions>{};
let auth:Auth = new Auth();
auth.key = "S05wQBtvZ8LmuAkqiDMXWKvJI1SBeR9H6kE9poWQVeA6MLGp508h7gLX0Wce92u6";
auth.secret = "iDCk1PtTyucLSlj5wRYIeSrphteLX2ESRONkcsxjhbg2PubidzGps34bKw98tm2D";
opts.auth = auth;
opts.test = true;
opts.useServerTime = true;

const bot = new Bot(opts);
Bot.binance.init().then(async markets => {
	await Bot.binance.rest.newOrder(Order.marketBuy);
});

