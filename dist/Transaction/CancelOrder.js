"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryOrder_1 = require("./QueryOrder");
class CancelOrder extends QueryOrder_1.QueryOrder {
    constructor(symbol, orderId, recvWindow, origClientOrderId, newClientOrderId) {
        super(symbol, orderId, recvWindow, origClientOrderId);
        this.newClientOrderId = newClientOrderId;
    }
}
exports.CancelOrder = CancelOrder;
//# sourceMappingURL=CancelOrder.js.map