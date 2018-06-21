import * as Html5WebSocket from 'html5-websocket'
import {default as ReconnectingWebSocket, iReconWSOptions} from "./ReconnectingWebSocket/ReconnectingWebSocket";
import {iStreamTickerRaw} from "../ExchangeInfo/Interfaces/iStreamTickerRaw";
import {Price} from "../Transaction/Price";
import {Ticker} from "../ExchangeInfo/ticker";
import {iBinanceOptions} from "../Binance/Interfaces/iBinanceOptions";
import {BinanceRest} from "../Rest/BinanceRest";

export class WsBinance extends BinanceRest{
	private _cache: any;
	private readonly _reconOptions: iReconWSOptions = <iReconWSOptions>{};
	private _ws: ReconnectingWebSocket;
	public base: string = 'wss://stream.binance.com:9443/ws';
	private isAlive:boolean = false;
	public options: iBinanceOptions;

	private _url: string;

	get url(): string {
		return this._url;
	}

	set url(value: string) {
		this._url = value;
	}

	private _getTickerUrl(symbol?: string | null): string {
		if (symbol && symbol !== null) {
			return `${this.base}/${symbol.toLowerCase()}@ticker`;
		} else {
			return `${this.base}/!ticker@arr`;
		}
	}

	public cache(payload: any | any[]): any[] {
		return Array.isArray(payload) ? payload : [payload];
	}

	public getPrices(cb: Function) {
		let ticksToPrices = (tickers: Ticker[]) => {
			let prices: Price[] = tickers.map(t => {
				return t.toPrice()
			});
			cb(prices);
		};
		this.getTickers(ticksToPrices);
	}

	public getTickers(cb: Function): any {
		let tickers: Ticker[];
		let w: ReconnectingWebSocket = this.openWebSocket(this._getTickerUrl(null));
		w.onmessage = msg => {
			let res: iStreamTickerRaw[];
			res = JSON.parse(msg.data);
			tickers = res.map((raw: iStreamTickerRaw) => {
				return new Ticker(raw);
			});
			cb(tickers);
		};

		return (options) => this._cache.forEach(w => w.close(1000, 'Close handle was called', {keepClosed: true, ...options}));
	}

	public getUser():Promise<any> {
		return new Promise(async (resolve, reject) => {
			const keepStreamAlive = (method, listenKey) => () => method({listenKey});
			this.user = async cb => {
				this.listenKey = await this.getDataStream();
				const w = this.openWebSocket(`${this.base}/${this.listenKey}`)
				w.onmessage = (msg) => (this.userEventHandler(cb)(msg));

				const int = setInterval(keepStreamAlive(this.keepDataStream, this.listenKey), 50e3);
				keepStreamAlive(this.keepDataStream, this.listenKey)();

				let result = async (options) => {
					clearInterval(int);
					await this.closeDataStream();
					w.close(1000, 'Close handle was called', {keepClosed: true, ...options});
				};
				resolve(result);
			}
		});
	}

	private heartbeat():void{
		setInterval(async ()=>{
			try{
				this.isAlive = await this.ping();
				if(!this.isAlive){
					console.log("Lost Connectivity. Restart the server using process.exit(0)");
				}
			}catch(err){
				//TODO: pass in a callback or kill process.
				//TODO: IMPORTANT. Create Error with proper code i.e code: 1001.
				//process.exit(0);
			}
		}, 3000);
	}

	public openWebSocket(url): ReconnectingWebSocket {
		if (url) {
			this.url = url;
			this._ws = new ReconnectingWebSocket(this.url, undefined, this._reconOptions);
			return this._ws;
		}
	}

	constructor(options: iBinanceOptions) {
		super(options);
		this.options = options;
		this._reconOptions = <iReconWSOptions>{};
		this._reconOptions.connectionTimeout = 4E3;
		this._reconOptions.constructor = typeof window !== 'undefined' ? WsBinance : Html5WebSocket;
		this._reconOptions.debug = false;
		this._reconOptions.maxReconnectionDelay = 10E3;
		this._reconOptions.maxRetries = Infinity;
		this._reconOptions.minReconnectionDelay = 4E3;
		this.heartbeat();
	}
}