"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
const BaseOrder_1 = require("./BaseOrder");
class Order extends BaseOrder_1.BaseOrder {
    static toBinance(order) {
        let binance = {};
        binance.clientOrderId = order.clientOrderId;
        binance.executedQty = (order.executedQty) ? order.executedQty.toString() : undefined;
        binance.orderId = order.orderId;
        binance.origQty = (order.origQty) ? order.origQty.toString() : undefined;
        binance.price = (order.price) ? order.price.toString() : undefined;
        binance.side = EOrderEnums_1.EOrderSide[order.side];
        binance.status = EOrderEnums_1.EOrderStatus[order.status];
        binance.symbol = order.symbol;
        binance.timeInForce = EOrderEnums_1.ETimeInForce[order.timeInForce];
        binance.type = EOrderEnums_1.EOrderType[order.type];
        return binance;
    }
    constructor(order) {
        super(order.side, order.symbol, order.type, parseFloat(order.price), order.timeInForce);
        this.executedQty = parseFloat(order.executedQty);
        this.orderId = order.orderId;
        this.origQty = parseFloat(order.origQty);
        this.status = EOrderEnums_1.EOrderStatus[order.status];
        this.clientOrderId = order.clientOrderId;
        this.transactTime = order.transactTime;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map