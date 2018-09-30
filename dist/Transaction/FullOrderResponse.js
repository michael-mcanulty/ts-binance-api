"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
const BaseOrder_1 = require("./BaseOrder");
class FullOrderResponse extends BaseOrder_1.BaseOrder {
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
    constructor(symbol, price, side, executedQty, orderId, origQty, status, timeInForce, type, clientOrderId, transactTime) {
        super(side, symbol, type, parseFloat(price), timeInForce);
        this.executedQty = parseFloat(executedQty);
        this.orderId = orderId;
        this.origQty = parseFloat(origQty);
        this.status = EOrderEnums_1.EOrderStatus[status];
        this.clientOrderId = clientOrderId;
        this.transactTime = transactTime;
    }
}
exports.FullOrderResponse = FullOrderResponse;
//# sourceMappingURL=FullOrderResponse.js.map