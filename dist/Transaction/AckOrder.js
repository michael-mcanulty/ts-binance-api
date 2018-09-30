"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signed_1 = require("../Rest/Signed");
class AckOrder extends Signed_1.Signed {
    constructor(clientId, symbol, transactTime, orderId) {
        super();
        this.clientId = clientId;
    }
}
exports.AckOrder = AckOrder;
//# sourceMappingURL=AckOrder.js.map