"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Fill {
    constructor(fill) {
        this.price = parseFloat(fill.price);
        this.qty = parseFloat(fill.qty);
        this.commission = parseFloat(fill.commission);
        this.commissionAsset = fill.commissionAsset;
    }
}
exports.Fill = Fill;
//# sourceMappingURL=Fill.js.map