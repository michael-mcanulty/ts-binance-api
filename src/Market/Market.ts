import {ILimits} from "../ExchangeInfo/Interfaces/ILimits";
import {ISymbol} from "../ExchangeInfo/Interfaces/ISymbol";
import {IPriceFilter} from "../ExchangeInfo/Interfaces/IPriceFilter";
import {ILotSize} from "../ExchangeInfo/Interfaces/ILotSize";
import {IMinNotional} from "../ExchangeInfo/Interfaces/IMinNotional";
import {ILimitsBinance} from "../ExchangeInfo/Interfaces/ILimitsBinance";

export class Market {
	baseAsset: string;
	limits: ILimits;
	quoteAsset: string;
	symbol: string;

	public static GetLimitsFromBinanceSymbol(symbol: ISymbol): ILimits {
		let binFilters: (IPriceFilter | ILotSize | IMinNotional)[] = symbol.filters;
		let mergedObj: ILimitsBinance = Object.assign.apply(Object, binFilters);
		let limits: ILimits = <ILimits>{};
		limits.maxPrice = parseFloat(mergedObj.maxPrice);
		limits.minPrice = parseFloat(mergedObj.minPrice);
		limits.maxQty = parseFloat(mergedObj.maxQty);
		limits.minQty = parseFloat(mergedObj.minQty);
		limits.minNotional = parseFloat(mergedObj.minNotional);
		limits.stepSize = parseFloat(mergedObj.stepSize);
		return limits;
	}

	constructor(symbol: string, baseAsset: string, quoteAsset: string, limits: ILimits) {
		this.symbol = symbol;
		this.baseAsset = baseAsset;
		this.quoteAsset = quoteAsset;
		this.limits = limits;
	}
}