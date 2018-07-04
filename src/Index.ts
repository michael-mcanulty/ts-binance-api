import {WSBinance} from "./Websocket/WSBinance";
import {Auth} from "./Account/Auth";
import {BinanceRest} from "./Rest/BinanceRest";
import {iBinanceOptions} from "./Binance/Interfaces/iBinanceOptions";

export class Binance{
	public api:BinanceRest;
	public ws: WSBinance;
	constructor(options:iBinanceOptions){
		this.api = new BinanceRest(options);
		this.ws = new WSBinance(options);
	}
}

let opts:iBinanceOptions = <iBinanceOptions>{};
let auth:Auth = new Auth();
auth.key = "L0FS9RPqvB8prFcE1hQCTiowHYpWdq16X1eyFZURGOOjdnz1LfE5fbquf7qUQQgK";
auth.secret = "ANyASMoj6iMAYjvpgcVNLWvEToDBj6bco8NTqKJqzvml2vp4zHSKwajpqU2hSBiy";
opts.auth = auth;
opts.test = true;
opts.useServerTime;

const client = new Binance(opts);
(async function(){
	client.ws.getPrices(res=>{
     console.log(res);
	});
})();
