"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseQueryOrder_1 = require("./BaseQueryOrder");
class QueryOrder extends BaseQueryOrder_1.BaseQueryOrder {
    constructor(opts) {
        super(opts.symbol, opts.orderId, opts.recvWindow);
        this.origClientOrderId = opts.origClientOrderId;
    }
}
exports.QueryOrder = QueryOrder;
//# sourceMappingURL=QueryOrder.js.map