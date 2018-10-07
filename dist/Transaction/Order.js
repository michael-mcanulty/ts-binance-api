"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOrder_1 = require("./BaseOrder");
class Order extends BaseOrder_1.BaseOrder {
    static toBinance(order) {
        let binance = {};
        binance.clientOrderId = order.clientOrderId;
        binance.executedQty = (order.executedQty) ? order.executedQty.toString() : undefined;
        binance.orderId = order.orderId;
        binance.origQty = (order.origQty) ? order.origQty.toString() : undefined;
        binance.price = (order.price) ? order.price.toString() : undefined;
        binance.side = order.side;
        binance.status = order.status;
        binance.symbol = order.symbol;
        binance.timeInForce = order.timeInForce;
        binance.type = order.type;
        return binance;
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