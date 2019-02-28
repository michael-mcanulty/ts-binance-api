"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOrder_1 = require("./BaseOrder");
class Order extends BaseOrder_1.BaseOrder {
    static toBinance(order) {
        let nOrder = {};
        nOrder.clientOrderId = order.clientOrderId;
        nOrder.executedQty = (order.executedQty) ? order.executedQty.toString() : undefined;
        nOrder.orderId = order.orderId;
        nOrder.origQty = (order.origQty) ? order.origQty.toString() : undefined;
        nOrder.price = (order.price) ? order.price.toString() : undefined;
        nOrder.side = order.side;
        nOrder.status = order.status;
        nOrder.symbol = order.symbol;
        nOrder.timeInForce = order.timeInForce;
        nOrder.type = order.type;
        return nOrder;
    }
    constructor(order) {
        super(order);
        this.executedQty = parseFloat(order.executedQty);
        this.orderId = order.orderId;
        this.origQty = parseFloat(order.origQty);
        this.status = order.status;
        this.clientOrderId = order.clientOrderId;
        this.transactTime = order.transactTime;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map