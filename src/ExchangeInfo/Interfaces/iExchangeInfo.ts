import {iSymbol} from "./iSymbol";

export interface iExchangeInfo {
	exchangeFilters?: (null)[] | null;
	serverTime: number;
	symbols: iSymbol[]
	timezone: string;
}
