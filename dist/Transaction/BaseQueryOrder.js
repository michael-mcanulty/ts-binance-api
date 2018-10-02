"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signed_1 = require("../Rest/Signed");
class BaseQueryOrder extends Signed_1.Signed {
    constructor(symbol, orderId, recvWindow) {
        super();
        this.symbol = symbol;
        this.orderId = orderId;
        this.recvWindow = recvWindow;
    }
}
exports.BaseQueryOrder = BaseQueryOrder;
//# sourceMappingURL=BaseQueryOrder.js.map