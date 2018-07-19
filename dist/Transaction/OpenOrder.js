"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOrder_1 = require("./BaseOrder");
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class OpenOrder extends BaseOrder_1.BaseOrder {
    constructor(clientOrderId, executedQty, orderId, origQty, price, side, status, symbol, type, timeInForce, icebergQty, isWorking, stopPrice, time) {
        super(parseFloat(price), side, symbol, type, timeInForce);
        this.clientOrderId = clientOrderId;
        this.executedQty = parseFloat(executedQty);
        this.orderId = orderId;
        this.status = status;
        this.icebergQty = parseFloat(icebergQty);
        this.isWorking = isWorking;
        this.stopPrice = parseFloat(stopPrice);
        this.symbol = symbol;
        this.time = time;
    }

    static toBinance(openOrder) {
        let binance = {};
        binance.clientOrderId = openOrder.clientOrderId;
        binance.executedQty = (openOrder.executedQty) ? openOrder.executedQty.toString() : undefined;
        binance.icebergQty = (openOrder.icebergQty) ? openOrder.icebergQty.toString() : undefined;
        binance.isWorking = openOrder.isWorking;
        binance.orderId = openOrder.orderId;
        binance.origQty = (openOrder.origQty) ? openOrder.origQty.toString() : undefined;
        binance.price = (openOrder.price) ? openOrder.price.toString() : undefined;
        binance.side = EOrderEnums_1.EOrderSide[openOrder.side];
        binance.status = EOrderEnums_1.EOrderStatus[openOrder.status];
        binance.stopPrice = (openOrder.stopPrice) ? openOrder.stopPrice.toString() : undefined;
        binance.symbol = openOrder.symbol;
        binance.timeInForce = EOrderEnums_1.ETimeInForce[openOrder.timeInForce];
        binance.time = openOrder.time;
        binance.type = EOrderEnums_1.EOrderType[openOrder.type];
        return binance;
    }
}
exports.OpenOrder = OpenOrder;
//# sourceMappingURL=OpenOrder.js.map