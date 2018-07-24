export declare class Price {
    symbol: string;
    value: number;
    static GetPriceValue(prices: Price[], symbol: string): number;
    constructor(symbol: string, value: string | number);
}
