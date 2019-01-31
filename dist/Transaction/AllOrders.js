"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseQueryOrder_1 = require("./BaseQueryOrder");
class AllOrders extends BaseQueryOrder_1.BaseQueryOrder {
    toObjLiteral() {
        let self = this;
        let allOrders = {};
        for (let prop in self) {
            if (self[prop] && typeof self[prop] !== "function") {
                allOrders[prop] = self[prop];
            }
        }
        return allOrders;
    }
    constructor(config) {
        let all = {};
        all.orderId = config.orderId;
        all.recvWindow = config.recvWindow;
        all.symbol = config.symbol;
        super(all);
        this.limit = config.limit || 500;
    }
}
exports.AllOrders = AllOrders;
//# sourceMappingURL=AllOrders.js.map