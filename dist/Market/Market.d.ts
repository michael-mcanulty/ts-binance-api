import { ILimits } from "../ExchangeInfo/Interfaces/ILimits";
import { ISymbol } from "../ExchangeInfo/Interfaces/ISymbol";
export declare class Market {
    baseAsset: string;
    date?: Date;
    limits: ILimits;
    quoteAsset: string;
    symbol: string;
    static GetLimitsFromBinanceSymbol(symbol: ISymbol): ILimits;
    constructor(symbol: string, baseAsset: string, quoteAsset: string, limits: ILimits);
}
