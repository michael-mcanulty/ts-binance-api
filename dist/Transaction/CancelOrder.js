"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryOrder_1 = require("./QueryOrder");
class CancelOrder extends QueryOrder_1.QueryOrder {
    constructor(opts) {
        let qOpts = {};
        qOpts.orderId = opts.orderId;
        qOpts.origClientOrderId = opts.origClientOrderId;
        qOpts.recvWindow = opts.recvWindow;
        qOpts.symbol = opts.symbol;
        super(qOpts);
        this.newClientOrderId = opts.newClientOrderId;
    }
}
exports.CancelOrder = CancelOrder;
//# sourceMappingURL=CancelOrder.js.map