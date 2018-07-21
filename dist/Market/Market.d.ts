import { IMarket } from "./interfaces/IMarket";
import { ILimits } from "../ExchangeInfo/Interfaces/ILimits";
import { ISymbol } from "../ExchangeInfo/Interfaces/ISymbol";
export declare class Market {
    _id?: string;
    baseAsset: string;
    date?: Date;
    limits: ILimits;
    quoteAsset: string;
    symbol: string;
    static fromDBFormat(imarkets: IMarket[]): Market[];
    static toDBFormat(markets: Market[]): IMarket[];
    static GetLimitsFromBinanceSymbol(symbol: ISymbol): ILimits;
    constructor(symbol: string, baseAsset: string, quoteAsset: string, limits: ILimits, id?: string, date?: Date);
}
