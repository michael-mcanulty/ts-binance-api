"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Balance {
    constructor(asset, available, onOrder, date) {
        if (date) {
            this.date = date;
        }
        else {
            this.date = new Date();
        }
        this.asset = asset;
        this.available = parseFloat(available);
        this.onOrder = parseFloat(onOrder);
    }
}
exports.Balance = Balance;
//# sourceMappingURL=Balance.js.map