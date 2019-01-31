import { ISymbol } from "./ISymbol";
export interface IExchangeInfo {
    exchangeFilters?: (null)[] | null;
    serverTime: number;
    symbols: ISymbol[];
    timezone: string;
}
