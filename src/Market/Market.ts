import {IMarket} from "./interfaces/IMarket";
import {Logger} from "../Logger/Logger";
import {ILimits} from "../ExchangeInfo/Interfaces/ILimits";
import {ISymbol} from "../ExchangeInfo/Interfaces/ISymbol";
import {IPriceFilter} from "../ExchangeInfo/Interfaces/IPriceFilter";
import {ILotSize} from "../ExchangeInfo/Interfaces/ILotSize";
import {IMinNotional} from "../ExchangeInfo/Interfaces/IMinNotional";
import {ILimitsBinance} from "../ExchangeInfo/Interfaces/ILimitsBinance";

export class Market {
	_id?: string;
	baseAsset: string;
	date?: Date;
	limits: ILimits;
	quoteAsset: string;
	symbol: string;

	public static fromDBFormat(imarkets: IMarket[]) {
		if (imarkets && imarkets.length > 0) {
			let markets: Market[] = [];
			imarkets.forEach(im => {
				let market = new Market(im.symbol, im.baseAsset, im.quoteAsset, im.limits, im._id, im.date);
				markets.push(market);
			});
			return markets;
		} else {
			Logger.error("Error retrieving the market");
		}
	}

	public static toDBFormat(markets: Market[]) {
		if (markets && markets.length > 0) {
			let imarkets: IMarket[] = [];
			markets.forEach(m => {
				let market = <IMarket>{};
				market._id = m._id;
				market.symbol = m.symbol;
				market.date = m.date;
				market.baseAsset = m.baseAsset;
				market.quoteAsset = m.quoteAsset;
				market.limits = m.limits;
				imarkets.push(market);
			});
			return imarkets;
		} else {
			return [];
		}
	}

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

	constructor(symbol: string, baseAsset: string, quoteAsset: string, limits: ILimits, id?: string, date?: Date) {
		this.symbol = symbol;
		this.baseAsset = baseAsset;
		this.quoteAsset = quoteAsset;
		this.limits = limits;
		if (id) this._id = id;
		if (date) {
			this.date = date;
		} else {
			this.date = new Date();
		}
	}
}