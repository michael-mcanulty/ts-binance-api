"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOrder_1 = require("./BaseOrder");
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class OpenOrder extends BaseOrder_1.BaseOrder {
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
    constructor(openOrder) {
        let base = {};
        base.cummulativeQuoteQty = openOrder.cummulativeQuoteQty;
        base.type = openOrder.type;
        base.price = openOrder.price;
        base.side = openOrder.side;
        base.symbol = openOrder.symbol;
        base.timeInForce = openOrder.timeInForce;
        super(base);
        this.clientOrderId = openOrder.clientOrderId;
        this.executedQty = parseFloat(openOrder.executedQty);
        this.orderId = openOrder.orderId;
        this.status = status;
        this.icebergQty = parseFloat(openOrder.icebergQty);
        this.isWorking = openOrder.isWorking;
        this.stopPrice = parseFloat(openOrder.stopPrice);
        this.symbol = openOrder.symbol;
        this.time = openOrder.time;
    }
}
exports.OpenOrder = OpenOrder;
//# sourceMappingURL=OpenOrder.js.map