"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signed_1 = require("../Rest/Signed");
class BaseQueryOrder extends Signed_1.Signed {
    constructor(baseQuery) {
        super();
        this.symbol = baseQuery.symbol;
        this.orderId = baseQuery.orderId;
        this.recvWindow = baseQuery.recvWindow;
        this.signature = baseQuery.signature || undefined;
        this.timestamp = baseQuery.timestamp || undefined;
    }
}
exports.BaseQueryOrder = BaseQueryOrder;
//# sourceMappingURL=BaseQueryOrder.js.map