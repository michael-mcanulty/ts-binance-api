import {WSBinance} from "./Websocket/WSBinance";
import {Auth} from "./Account/Auth";
import {BinanceRest} from "./Rest/BinanceRest";
import {iBinanceOptions} from "./Binance/Interfaces/iBinanceOptions";
import {IExchangeInfo} from "./Rest/Interfaces/IExchangeInfo";

export class BinanceApi{
	public static http:BinanceRest;
	public static websocket: WSBinance;
	constructor(options:iBinanceOptions){
		BinanceApi.http = new BinanceRest(options);
		BinanceApi.websocket = new WSBinance(options);
	}
}

let opts:iBinanceOptions = <iBinanceOptions>{};
let auth:Auth = new Auth();
auth.key = "L0FS9RPqvB8prFcE1hQCTiowHYpWdq16X1eyFZURGOOjdnz1LfE5fbquf7qUQQgK";
auth.secret = "ANyASMoj6iMAYjvpgcVNLWvEToDBj6bco8NTqKJqzvml2vp4zHSKwajpqU2hSBiy";
opts.auth = auth;
opts.test = true;
opts.useServerTime;

const client = new BinanceApi(opts);
(async ()=>{
	let info: IExchangeInfo = await BinanceApi.http.getExchangeInfo();
	console.log(info);
})();
