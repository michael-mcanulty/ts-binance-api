import {Auth} from "./Account/Auth";
import {IBinanceOptions} from "./Binance/Interfaces/IBinanceOptions";
import {Binance} from "./Binance/Binance";
import {Order} from "./Transaction/Order";

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

		let sellStorm: Order | {} = await Bot.binance.rest.limitSell("STORMBTC", 550, 0.00000555, 5000);
		console.log(sellStorm);

		//let allOrders:Order[]= await Bot.binance.rest.getAllOrders("ETHUSDT", 100, null, 5000);
		//console.log(allOrders);

		//let openOrders:OpenOrder[] = await Bot.binance.rest.getOpenOrders("STORMBTC");
		//console.log(openOrders);

		//let sell:Order = Bot.binance.rest.limitSell("STORMBTC", 10, );

		//let bals: Balance[] = await Bot.binance.rest.getBalances(5000, true);
		//console.log(bals);

		//let cancel = await Bot.binance.rest.cancelOrder("STORMBTC", 17753723);
		//console.log(cancel);

		//let cancel:any = await Bot.binance.rest.cancelOrdersBySymbol("STORMBTC");
		//console.log(cancel);

	} catch (err) {
		console.log(err);
	}
});

