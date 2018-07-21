"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Balance {
    constructor(asset, available, onOrder, date) {
        this.date = (date) ? date : new Date();
        this.asset = asset;
        this.available = parseFloat(available);
        this.onOrder = parseFloat(onOrder);
    }
}
exports.Balance = Balance;
//# sourceMappingURL=Balance.js.map