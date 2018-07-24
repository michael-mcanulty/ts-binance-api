"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Price {
    static GetPriceValue(prices, symbol) {
        if (!prices || prices.length === 0)
            return 0;
        let priceFilter = prices.filter(x => x.symbol === symbol);
        let price = 0;
        if (priceFilter.length > 0) {
            price = priceFilter[0].value;
        }
        return price;
    }
    constructor(symbol, value) {
        this.symbol = symbol;
        if (value) {
            this.value = parseFloat(value.toString());
        }
    }
}
exports.Price = Price;
//# sourceMappingURL=Price.js.map