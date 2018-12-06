import {RestCandle} from "./RestCandle";
import {IStreamRawKline, IStreamRawKlineResponse} from "./Interfaces/ICandleBinance";
import {Candle} from "./Candle";

export class WSCandle extends RestCandle{
	symbol: string;
	interval: string;
	firstTradeId: number;
	lastTradeId: number;
	closed: boolean;

	toCandle(): Candle{
		return new Candle(new Date(this.openTime), parseFloat(this.open), parseFloat(this.high), parseFloat(this.low), parseFloat(this.close), parseFloat(this.volume), new Date(this.closeTime));
	}

	constructor(candle: IStreamRawKline){
		super(candle.t, candle.o, candle.h, candle.l, candle.c, candle.v, candle.T, candle.q, candle.n, candle.V, candle.Q, candle.B);
		this.symbol = candle.s;
		this.interval = candle.i;
	}
}

export class WSCandleResp {
	eventType: string;
	eventTime: number;
	symbol: string;
	candle: WSCandle;

	constructor(klineWs: IStreamRawKlineResponse){
		let kline: IStreamRawKline = <IStreamRawKline> klineWs.k;
		this.eventType = klineWs.e;
		this.eventTime = klineWs.E;
		this.symbol = klineWs.s;
		this.candle = new WSCandle(kline);
	}
}