"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseQueryOrder_1 = require("./BaseQueryOrder");
class AllOrders extends BaseQueryOrder_1.BaseQueryOrder {
    constructor(symbol, orderId, limit, recvWindow) {
        super(symbol, orderId, recvWindow);
    }
}
exports.AllOrders = AllOrders;
//# sourceMappingURL=AllOrders.js.map