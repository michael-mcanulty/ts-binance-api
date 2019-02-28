"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOrder_1 = require("./BaseOrder");
class NewOrder extends BaseOrder_1.BaseOrder {
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
    static toBinance(newOrder) {
        let nOrder = {};
        nOrder.quantity = (newOrder.quantity) ? newOrder.quantity : undefined;
        nOrder.icebergQty = (newOrder.icebergQty) ? newOrder.icebergQty : undefined;
        nOrder.price = (newOrder.price) ? newOrder.price : undefined;
        nOrder.side = newOrder.side;
        nOrder.stopPrice = (newOrder.stopPrice) ? newOrder.stopPrice : undefined;
        nOrder.symbol = newOrder.symbol;
        nOrder.timeInForce = newOrder.timeInForce;
        nOrder.type = newOrder.type;
        return nOrder;
    }
    constructor(newOrder) {
        super(newOrder);
        this.quantity = newOrder.quantity;
        this.icebergQty = newOrder.icebergQty;
        this.newOrderRespType = newOrder.newOrderRespType || 'FULL';
        this.newClientOrderId = newOrder.newClientOrderId;
        this.stopPrice = newOrder.stopPrice;
        this.recvWindow = newOrder.recvWindow || 5000;
    }
}
exports.NewOrder = NewOrder;
//# sourceMappingURL=NewOrder.js.map