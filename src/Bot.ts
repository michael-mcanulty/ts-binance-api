import {BinanceApiAuth} from "./Account/BinanceApiAuth";
import {IBinanceOptions} from "./Binance/Interfaces/IBinanceOptions";
import {Binance} from "./Binance/Binance";
import {Order} from "./Transaction/Order";
import {TestOrder} from "./Transaction/TestOrder";

export class Bot {
	public static binance: Binance;

	constructor(opts: IBinanceOptions) {
		Binance.options = opts;
		Bot.binance = new Binance(opts);
	}
}

let opts: IBinanceOptions = <IBinanceOptions>{};
let auth: BinanceApiAuth = new BinanceApiAuth();
auth.key = "S05wQBtvZ8LmuAkqiDMXWKvJI1SBeR9H6kE9poWQVeA6MLGp508h7gLX0Wce92u6";
auth.secret = "iDCk1PtTyucLSlj5wRYIeSrphteLX2ESRONkcsxjhbg2PubidzGps34bKw98tm2D";
opts.auth = auth;
opts.test = false;
opts.useServerTime = true;

const bot = new Bot(opts);
Bot.binance.init().then(async markets => {

	try {
		let buyStorm: Order | TestOrder = await Bot.binance.rest.limitBuy("STORMBTC", 550, 0.00000155, 5000);
		console.log(buyStorm);

		//Bot.binance.websocket.candles(["STORMBTC", "STORMUSDT"], ["1m", "1hr"], res=>{
		//	console.log(res);
		//});
		/*
				Bot.binance.websocket.orders(res=>{console.log(res)});
				setTimeout(async( )=>{
					let sellStorm: Order | TestOrder = await Bot.binance.rest.limitSell("STORMBTC", 550, 0.00000555, 5000);
					console.log(sellStorm);
				}, 3000);
		*/
		//let allOrders:Order[]= await Bot.binance.rest.getAllOrders("ETHUSDT", 100, null, 5000);
		//console.log(allOrders);

		//let openOrders:OpenOrder[] = await Bot.binance.rest.getOpenOrders("STORMBTC");
		//console.log(openOrders);

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

