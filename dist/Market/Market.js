"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Market {
    static GetLimitsFromBinanceSymbol(symbol) {
        let binFilters = symbol.filters;
        let mergedObj = Object.assign.apply(Object, binFilters);
        let limits = {};
        limits.maxPrice = parseFloat(mergedObj.maxPrice);
        limits.minPrice = parseFloat(mergedObj.minPrice);
        limits.maxQty = parseFloat(mergedObj.maxQty);
        limits.minQty = parseFloat(mergedObj.minQty);
        limits.minNotional = parseFloat(mergedObj.minNotional);
        limits.stepSize = parseFloat(mergedObj.stepSize);
        return limits;
    }
    constructor(symbol, baseAsset, quoteAsset, limits) {
        this.symbol = symbol;
        this.baseAsset = baseAsset;
        this.quoteAsset = quoteAsset;
        this.limits = limits;
    }
}
exports.Market = Market;
//# sourceMappingURL=Market.js.map