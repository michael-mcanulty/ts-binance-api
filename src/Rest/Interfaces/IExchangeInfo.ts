import {ISymbol} from "../../ExchangeInfo/Interfaces/ISymbol";

export interface IExchangeInfo {
	exchangeFilters?: (null)[] | null;
	serverTime: number;
	symbols: ISymbol[]
	timezone: string;
}