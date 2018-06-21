import {iPriceFilter} from "./iPriceFilter";
import {iLotSize} from "./iLotSize";
import {iMinNotional} from "./iMinNotional";

export interface iSymbol {
	baseAsset: string;
	baseAssetPrecision: number;
	filters: (iPriceFilter | iLotSize | iMinNotional)[]; //(iPriceFilter|iLotSize|iMinNotional)
	icebergAllowed: boolean;
	orderTypes?: (string)[] | null;
	quoteAsset: string;
	quotePrecision: number;
	status: string;
	symbol: string;
}