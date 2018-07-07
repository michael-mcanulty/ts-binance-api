import {Auth} from "./Account/Auth";
import {iBinanceOptions} from "./Binance/Interfaces/iBinanceOptions";
import {IExchangeInfo} from "./Rest/Interfaces/IExchangeInfo";
import {Binance} from "./Binance/Binance";

export class Bot {
	public static binance: Binance;

	constructor(options:iBinanceOptions){
		Bot.binance = new Binance(options);
	}
}

let opts:iBinanceOptions = <iBinanceOptions>{};
let auth:Auth = new Auth();
auth.key = "L0FS9RPqvB8prFcE1hQCTiowHYpWdq16X1eyFZURGOOjdnz1LfE5fbquf7qUQQgK";
auth.secret = "ANyASMoj6iMAYjvpgcVNLWvEToDBj6bco8NTqKJqzvml2vp4zHSKwajpqU2hSBiy";
opts.auth = auth;
opts.test = true;
opts.useServerTime;

const client = new Bot(opts);
(async ()=>{
	let info: IExchangeInfo = await Bot.binance.rest.getExchangeInfo();
	console.log(info);
})();
