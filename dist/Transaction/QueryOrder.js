"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseQueryOrder_1 = require("./BaseQueryOrder");
class QueryOrder extends BaseQueryOrder_1.BaseQueryOrder {
    toObjLiteral() {
        let self = this;
        let order = {};
        for (let prop in self) {
            if (self[prop] && typeof self[prop] !== "function") {
                order[prop] = self[prop];
            }
        }
        return order;
    }
    constructor(opts) {
        let baseQuery = {};
        baseQuery.orderId = opts.orderId;
        baseQuery.recvWindow = opts.recvWindow;
        baseQuery.symbol = opts.symbol;
        super(baseQuery);
        this.origClientOrderId = opts.origClientOrderId;
    }
}
exports.QueryOrder = QueryOrder;
//# sourceMappingURL=QueryOrder.js.map