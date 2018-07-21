"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../Logger/Logger");
class Market {
    static fromDBFormat(imarkets) {
        if (imarkets && imarkets.length > 0) {
            let markets = [];
            imarkets.forEach(im => {
                let market = new Market(im.symbol, im.baseAsset, im.quoteAsset, im.limits, im._id, im.date);
                markets.push(market);
            });
            return markets;
        }
        else {
            Logger_1.Logger.error("Error retrieving the market");
        }
    }
    static toDBFormat(markets) {
        if (markets && markets.length > 0) {
            let imarkets = [];
            markets.forEach(m => {
                let market = {};
                market._id = m._id;
                market.symbol = m.symbol;
                market.date = m.date;
                market.baseAsset = m.baseAsset;
                market.quoteAsset = m.quoteAsset;
                market.limits = m.limits;
                imarkets.push(market);
            });
            return imarkets;
        }
        else {
            return [];
        }
    }
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
    constructor(symbol, baseAsset, quoteAsset, limits, id, date) {
        this.symbol = symbol;
        this.baseAsset = baseAsset;
        this.quoteAsset = quoteAsset;
        this.limits = limits;
        if (id)
            this._id = id;
        if (date) {
            this.date = date;
        }
        else {
            this.date = new Date();
        }
    }
}
exports.Market = Market;
//# sourceMappingURL=Market.js.map