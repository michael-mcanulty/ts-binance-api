import {default as ReconnectingWebSocket, IReconOptions} from "./ReconnectingWebSocket/ReconnectingWebSocket";
import {IStreamTickerRaw} from "../ExchangeInfo/Interfaces/IStreamTickerRaw";
import {Price} from "../Transaction/Price";
import {Ticker} from "../ExchangeInfo/ticker";
import {IBinanceOptions} from "../Binance/Interfaces/IBinanceOptions";
import {Rest} from "../Rest/Rest";
import {HttpError} from "../Error/HttpError";
import {IStreamRawKlineResponse} from "../ExchangeInfo/Interfaces/ICandleBinance";
import {Candle} from "../ExchangeInfo/Candle";
import {IOutboundAccountInfoStream} from "../Account/Interfaces/IOutboundAccountInfoStream";
import {IExecutionReportRaw} from "../Account/Interfaces/IExecutionReportRaw";
import {ExecutionReport} from "../Account/ExecutionReport";
import {OutboundAccountInfo} from "../Account/OutboundAccountInfo";
import Timer = NodeJS.Timer;
import {Binance} from "..";
import {ICandleWSOptions} from "./ICandleWSOptions";

export class BotWebsocket extends Rest{
	public static BASE: string = 'wss://stream.binance.com:9443/ws';
	public static CandleOpts: ICandleWSOptions = {"partial_kline_1min_prior": true, "partial_kline_minimum_interval": "15m"};
	private readonly _reconOptions: IReconOptions = <IReconOptions>{};
	private _ws: ReconnectingWebSocket;

	private _url: string;

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
		const self = this;
		const keepStreamAlive = (method, listenKey) => async () => await method.apply(this, {listenKey});
		self.getDataStream().then(async lk => {
			const listenKey = lk.listenKey;
			const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
			w.onmessage = (msg) => {
				let json = JSON.parse(msg.data);
				if (json.e === "outboundAccountInfo") {
					let infoRaw: IOutboundAccountInfoStream;
					infoRaw = json;
					let accountInfo: OutboundAccountInfo = OutboundAccountInfo.fromBinanceStream(infoRaw);
					callback(accountInfo);
				}
			};

			const int = setInterval(keepStreamAlive(self.keepDataStream, listenKey), 50e3);
			keepStreamAlive(self.keepDataStream, listenKey)();

			return async () => {
				clearInterval(int);
				await self.closeDataStream();
				w.close(1000, 'Close handle was called');
			};
		});
	}

	public candles(symbols: string[], intervals: string[], callback: Function): any {
		const withinLimits = (interval: string, latestEventTime: number, klineEventCloseTime: number)=>{
			let minPartialIntervalMins: number = Binance.intervalToMinutes[BotWebsocket.CandleOpts.partial_kline_minimum_interval];
			let intervalMinutes: number = Binance.intervalToMinutes[interval];

			if(!BotWebsocket.CandleOpts.partial_kline_1min_prior || (intervalMinutes < minPartialIntervalMins)){
				return false;
			}
			let rounded: number = Math.round(latestEventTime/1000)*1000;
			let minuteBeforeEnd: number = klineEventCloseTime - 59999;
			return (rounded === minuteBeforeEnd) || (rounded === minuteBeforeEnd+1000);
		};

		const symbolCache = symbols.map(symbol =>{
			return intervals.map(interval => {
				let w: ReconnectingWebSocket = this.openWebSocket(`${BotWebsocket.BASE}/${symbol.toLowerCase()}@kline_${interval}`);
				w.onmessage = async (msg) => {
					let klineRes: IStreamRawKlineResponse;
					klineRes = JSON.parse(msg.data);
					let candle: Candle;
					//Checks if the candle is partial.
					if (klineRes.k.x || withinLimits(interval, klineRes.E, klineRes.k.T)) {
						candle = Candle.fromStream(klineRes);
						callback(candle);
					}
				};
				return w;
			});
		});

		return (options) => symbolCache.forEach(cache => cache.forEach(w => w.close(1000, 'Close handle was called')));
	}

	public openWebSocket(url): ReconnectingWebSocket {
		if (url) {
			this.url = url;
			this._ws = new ReconnectingWebSocket(this.url, this._reconOptions);
			return this._ws;
		}
	}

	public orders(callback: Function): void {
		const self = this;
		const keepStreamAlive = (method, listenKey) => async () => await method.apply(this, {listenKey});
		self.getDataStream().then(async lk => {
			const listenKey = lk.listenKey;
			const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
			w.onmessage = (msg) => {
				let json = JSON.parse(msg.data);
				if (json.e === "executionReport") {
					let reportRaw: IExecutionReportRaw;
					reportRaw = json;
					let executionReport: ExecutionReport = ExecutionReport.fromBinanceStream(reportRaw);
					callback(executionReport);
				}
			};


			const int = setInterval(keepStreamAlive(self.keepDataStream, listenKey), 50e3);
			keepStreamAlive(self.keepDataStream, listenKey)();

			return async () => {
				clearInterval(int);
				await self.closeDataStream();
				w.close(1000, 'Close handle was called');
			};
		});
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

	public user(callback: Function): void {
		const self = this;
		const keepStreamAlive = (method, listenKey) => async () => await method.call(this, {listenKey});
		self.getDataStream().then(async lk => {
			const listenKey = lk.listenKey;
			const w = this.openWebSocket(`${BotWebsocket.BASE}/${listenKey}`);
			w.onmessage = (msg) => {
				let json = JSON.parse(msg.data);
				if (json.e === "executionReport") {
					let reportRaw: IExecutionReportRaw;
					reportRaw = json;
					let executionReport: ExecutionReport = ExecutionReport.fromBinanceStream(reportRaw);
					callback(executionReport);
				} else if (json.e === "outboundAccountInfo") {
					let infoRaw: IOutboundAccountInfoStream;
					infoRaw = json;
					let accountInfo: OutboundAccountInfo = OutboundAccountInfo.fromBinanceStream(infoRaw);
					callback(accountInfo);
				}
			};

			const int = setInterval(keepStreamAlive(self.keepDataStream, listenKey), 50e3);
			keepStreamAlive(self.keepDataStream, listenKey)();

			return async () => {
				clearInterval(int);
				await self.closeDataStream();
				w.close(1000, 'Close handle was called');
			};
		});
	}

	constructor(options: IBinanceOptions) {
		super(options);
		this._reconOptions = <IReconOptions>{};
		this._reconOptions.connectionTimeout = 4E3;
		this._reconOptions.constructor = BotWebsocket;
		this._reconOptions.debug = false;
		this._reconOptions.maxReconnectionDelay = 10E3;
		this._reconOptions.maxRetries = Infinity;
		this._reconOptions.minReconnectionDelay = 4E3;
	}
}