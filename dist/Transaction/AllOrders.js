"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseQueryOrder_1 = require("./BaseQueryOrder");
class AllOrders extends BaseQueryOrder_1.BaseQueryOrder {
    constructor(config) {
        super(config.symbol, config.orderId, config.recvWindow);
        this.limit = config.limit || 500;
    }
}
exports.AllOrders = AllOrders;
//# sourceMappingURL=AllOrders.js.map