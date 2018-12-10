import { RestCandle } from "./RestCandle";
import { IStreamRawKline, IStreamRawKlineResponse } from "./Interfaces/ICandleBinance";
import { Candle } from "./Candle";
export declare class WSCandle extends RestCandle {
    symbol: string;
    interval: string;
    firstTradeId: number;
    lastTradeId: number;
    closed: boolean;
    toCandle(): Candle;
    constructor(candle: IStreamRawKline);
}
export declare class WSCandleResp {
    eventType: string;
    eventTime: number;
    symbol: string;
    candle: WSCandle;
    constructor(klineWs: IStreamRawKlineResponse);
}
