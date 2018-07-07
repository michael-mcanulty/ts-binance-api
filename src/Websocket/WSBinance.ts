import * as Html5WebSocket from 'html5-websocket'
import {default as ReconnectingWebSocket, iReconWSOptions} from "./ReconnectingWebSocket/ReconnectingWebSocket";
import {IStreamTickerRaw} from "../ExchangeInfo/Interfaces/IStreamTickerRaw";
import {Price} from "../Transaction/Price";
import {Ticker} from "../ExchangeInfo/ticker";
import {iBinanceOptions} from "../Binance/Interfaces/iBinanceOptions";
import {BinanceRest} from "../Rest/BinanceRest";
import {HttpError} from "../Error/HttpError";
import {IStreamRawKlineResponse} from "../ExchangeInfo/Interfaces/ICandleBinance";
import {Candle} from "../ExchangeInfo/Candle";

export class WSBinance extends BinanceRest {
	private static _INSTANCE: WSBinance;
	private readonly _reconOptions: iReconWSOptions = <iReconWSOptions>{};
	private static _ws: ReconnectingWebSocket;
	public base: string = 'wss://stream.binance.com:9443/ws';
	private static isAlive: boolean = false;
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

	public static get Instance() {
		return this._INSTANCE;
	}

	private _getTickers(cb: Function): any {
		let tickers: Ticker[];
		let w: ReconnectingWebSocket = this.openWebSocket(this._getTickerUrl(null));
		w.onmessage = msg => {
			let res: IStreamTickerRaw[];
			res = JSON.parse(msg.data);
			tickers = res.map((raw: IStreamTickerRaw) => {
				return new Ticker(raw);
			});
			cb(tickers);
		};

		return (options) => w.close(1000, 'Close handle was called');
	}

	public candles(symbols:string[], intervals:string[], cb:Function):any{
		const symbolCache = symbols.map(symbol=>{
	  	return intervals.map(interval=>{
				let w: ReconnectingWebSocket = this.openWebSocket(`${this.base}/${symbol.toLowerCase()}@kline_${interval}`);
				w.onmessage = msg => {
					let klineRes: IStreamRawKlineResponse;
					klineRes = JSON.parse(msg.data);
					let candle:Candle;
					if(klineRes.k.x){
						candle = Candle.fromStream(klineRes);
						cb(candle);
					}
				};
				return w;
			});
		});

		return (options) => symbolCache.forEach(cache => cache.forEach(w=>w.close(1000, 'Close handle was called')));
	};

	public getUser(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const keepStreamAlive = (method, listenKey) => () => method({listenKey});
			this.user = async cb => {
				BinanceRest.listenKey = await this.getDataStream();
				const w = this.openWebSocket(`${this.base}/${BinanceRest.listenKey}`);
				w.onmessage = (msg) => (this.userEventHandler(cb)(msg));

				const int = setInterval(keepStreamAlive(this.keepDataStream, BinanceRest.listenKey), 50e3);
				keepStreamAlive(this.keepDataStream, BinanceRest.listenKey)();

				let result = async () => {
					clearInterval(int);
					await this.closeDataStream();
					w.close(1000, 'Close handle was called');
				};
				resolve(result);
			}
		});
	}

	//Check for disconnected state
	private static heartbeat(): void {
		setInterval(async () => {
			try {
				this.isAlive = await WSBinance.Instance.ping();
			} catch (err) {
				let error: HttpError = new HttpError({msg: 'DISCONNECTED', code: -1001});
				WSBinance._ws.close(error.code, error.message);
			}
		}, 3000);
	}

	public openWebSocket(url): ReconnectingWebSocket {
		if (url) {
			this.url = url;
			WSBinance._ws = new ReconnectingWebSocket(this.url, undefined, this._reconOptions);
			return WSBinance._ws;
		}
	}

	public prices(cb: Function) {
		let ticksToPrices = (tickers: Ticker[]) => {
			let prices: Price[] = tickers.map(t => {
				return t.toPrice();
			});
			cb(prices);
		};

		this._getTickers(ticksToPrices);
	}

	constructor(options?: iBinanceOptions) {
		super(options);
		this.options = options;
		this._reconOptions = <iReconWSOptions>{};
		this._reconOptions.connectionTimeout = 4E3;
		this._reconOptions.constructor = typeof window !== 'undefined' ? WSBinance : Html5WebSocket;
		this._reconOptions.debug = false;
		this._reconOptions.maxReconnectionDelay = 10E3;
		this._reconOptions.maxRetries = Infinity;
		this._reconOptions.minReconnectionDelay = 4E3;
	}
}