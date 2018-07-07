export interface ISymbol {
	baseAsset: string;
	baseAssetPrecision: number;
	filters: (IPriceFilter | ILotSize | IMinNotional)[]; //(IPriceFilter|ILotSize|IMinNotional)
	icebergAllowed: boolean;
	orderTypes?: (string)[] | null;
	quoteAsset: string;
	quotePrecision: number;
	status: string;
	symbol: string;
}

export interface ILimitsBinance {
	filterType: string;
	maxPrice: string;
	maxQty: string;
	minNotional: string;
	minPrice: string;
	minQty: string;
	stepSize: string;
	tickSize: string;
}

export interface ILimits {
	maxPrice: number;
	maxQty: number;
	minNotional: number;
	minPrice: number;
	minQty: number;
	stepSize: number;
}

export interface IPriceFilter {
	filterType: string;
	maxPrice: string;
	minPrice: string;
	tickSize: string;
}

export interface ILotSize {
	filterType: string;
	maxQty: string;
	minQty: string;
	stepSize: string;
}

export interface IMinNotional {
	filterType: string;
	minNotional: string;
}

export interface IExchangeInfo {
	exchangeFilters?: (null)[] | null;
	serverTime: number;
	symbols: ISymbol[]
	timezone: string;
}