import * as Html5WebSocket from 'html5-websocket'
import {default as ReconnectingWebSocket, iReconWSOptions} from "./ReconnectingWebSocket/ReconnectingWebSocket";
import {IStreamTickerRaw} from "../ExchangeInfo/Interfaces/IStreamTickerRaw";
import {Price} from "../Transaction/Price";
import {Ticker} from "../ExchangeInfo/ticker";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {Rest} from "../Rest/Rest";
import {HttpError} from "../Error/HttpError";
import {IStreamRawKlineResponse} from "../ExchangeInfo/Interfaces/ICandleBinance";
import {Candle} from "../ExchangeInfo/Candle";
import {IOutboundAccountInfoRaw} from "../Account/Interfaces/IOutboundAccountInfoRaw";
import {OutboundAccountInfo} from "../Account/OutboundAccountInfo";

export class BotWebsocket extends Rest {
	private static _INSTANCE: BotWebsocket;
	private readonly _reconOptions: iReconWSOptions = <iReconWSOptions>{};
	private static _ws: ReconnectingWebSocket;
	public static BASE: string = 'wss://stream.binance.com:9443/ws';
	private static isAlive: boolean = false;
	public options: IBinanceOptions;
	private _url: string;

	public static get Instance() {
		return this._INSTANCE;
	}

	get url(): string {
		return this._url;
	}

	set url(value: string) {
		this._url = value;
	}

	_getTickerUrl(symbol?: string | null): string {
		if (symbol && symbol !== null) {
			return `${BotWebsocket.BASE}/${symbol.toLowerCase()}@ticker`;
		} else {
			return `${BotWebsocket.BASE}/!ticker@arr`;
		}
	}

	_getTickers(callback: Function): any {
		let tickers: Ticker[];
		let w: ReconnectingWebSocket = this.openWebSocket(this._getTickerUrl(null));
		w.onmessage = msg => {
			let res: IStreamTickerRaw[];
			res = JSON.parse(msg.data);
			tickers = res.map((raw: IStreamTickerRaw) => {
				return new Ticker(raw);
			});
			callback(tickers);
		};

		return (options) => w.close(1000, 'Close handle was called');
	}

	public balances(callback: Function): void {
		const keepStreamAlive = (method, listenKey) => () => method({listenKey});
		this.getDataStream().then(listenKey => {
			const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
			w.onmessage = (msg) => {
				let json = JSON.parse(msg.data);
				let infoRaw: IOutboundAccountInfoRaw = json;
				let accountInfo: OutboundAccountInfo = OutboundAccountInfo.fromBinanceApi(infoRaw);
				callback(accountInfo);
			};

			const int = setInterval(keepStreamAlive(this.keepDataStream, listenKey), 50e3);
			keepStreamAlive(this.keepDataStream, listenKey)();

			let result = async () => {
				clearInterval(int);
				await this.closeDataStream();
				w.close(1000, 'Close handle was called');
			};
		});
	}

	public candles(symbols: string[], intervals: string[], callback: Function): any {
		const symbolCache = symbols.map(symbol => {
			return intervals.map(interval => {
				let w: ReconnectingWebSocket = this.openWebSocket(`${BotWebsocket.BASE}/${symbol.toLowerCase()}@kline_${interval}`);
				w.onmessage = msg => {
					let klineRes: IStreamRawKlineResponse;
					klineRes = JSON.parse(msg.data);
					let candle: Candle;
					let qa: string = this.getQuoteAssetName(symbol);
					if (klineRes.k.x) {
						candle = Candle.fromStream(klineRes, qa);
						callback(candle);
					}
				};
				return w;
			});
		});

		return (options) => symbolCache.forEach(cache => cache.forEach(w => w.close(1000, 'Close handle was called')));
	}

	private static heartbeat(): void {
		setInterval(async () => {
			try {
				this.isAlive = await BotWebsocket.Instance.ping();
			} catch (err) {
				let error: HttpError = new HttpError({msg: 'DISCONNECTED', code: -1001});
				BotWebsocket._ws.close(error.code, error.message);
			}
		}, 3000);
	}

	public openWebSocket(url): ReconnectingWebSocket {
		if (url) {
			this.url = url;
			BotWebsocket._ws = new ReconnectingWebSocket(this.url, undefined, this._reconOptions);
			return BotWebsocket._ws;
		}
	}

	public prices(callback: Function) {
		let ticksToPrices = (tickers: Ticker[]) => {
			let prices: Price[] = tickers.map(t => {
				return t.toPrice();
			});
			callback(prices);
		};

		this._getTickers(ticksToPrices);
	}

	constructor(options?: IBinanceOptions) {
		super(options);
		this.options = options;
		this._reconOptions = <iReconWSOptions>{};
		this._reconOptions.connectionTimeout = 4E3;
		this._reconOptions.constructor = typeof window !== 'undefined' ? BotWebsocket : Html5WebSocket;
		this._reconOptions.debug = false;
		this._reconOptions.maxReconnectionDelay = 10E3;
		this._reconOptions.maxRetries = Infinity;
		this._reconOptions.minReconnectionDelay = 4E3;
	}
}