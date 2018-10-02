import { IPriceFilter } from "./IPriceFilter";
import { ILotSize } from "./ILotSize";
import { IMinNotional } from "./IMinNotional";
export interface ISymbol {
    baseAsset: string;
    baseAssetPrecision: number;
    filters: (IPriceFilter | ILotSize | IMinNotional)[];
    icebergAllowed: boolean;
    orderTypes?: (string)[] | null;
    quoteAsset: string;
    quotePrecision: number;
    status: string;
    symbol: string;
}
