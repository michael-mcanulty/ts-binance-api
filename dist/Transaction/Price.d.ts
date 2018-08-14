import { IPrice } from "./Interfaces/IPrice";
export declare class Price {
    symbol: string;
    value: number;
    static GetPriceValue(prices: Price[], symbol: string): number;
    static toPrices(rawPrices: IPrice[]): Price[];
    constructor(symbol: string, value: string | number);
}
