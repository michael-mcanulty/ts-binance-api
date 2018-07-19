"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Price {
    constructor(symbol, value) {
        this.symbol = symbol;
        if (value) {
            this.value = parseFloat(value.toString());
        }
    }
}
exports.Price = Price;
//# sourceMappingURL=Price.js.map