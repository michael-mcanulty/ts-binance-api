"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
const BaseOrder_1 = require("./BaseOrder");
class NewOrder extends BaseOrder_1.BaseOrder {
    static binanceFormat(newOrder) {
        let binance = {};
        binance.icebergQty = newOrder.icebergQty;
        binance.price = newOrder.price;
        binance.side = EOrderEnums_1.EOrderSide[newOrder.side];
        binance.stopPrice = newOrder.stopPrice;
        binance.symbol = newOrder.symbol;
        binance.timeInForce = EOrderEnums_1.ETimeInForce[newOrder.timeInForce];
        binance.type = EOrderEnums_1.EOrderType[newOrder.type];
        return binance;
    }
    constructor(clientOrderId, executedQty, orderId, origQty, price, side, status, symbol, timeInForce, type, quantity, icebergQty, stopPrice, recvWindow, newClientOrderId, newOrderRespType) {
        super(price, side, symbol, timeInForce, type);
        this.quantity = quantity;
        this.icebergQty = parseFloat(icebergQty);
        this.newOrderRespType = EOrderEnums_1.ENewOrderRespType[newOrderRespType] || EOrderEnums_1.ENewOrderRespType[EOrderEnums_1.ENewOrderRespType.RESULT];
        this.newClientOrderId = newClientOrderId;
        this.stopPrice = parseFloat(stopPrice);
        this.recvWindow = recvWindow || 5000;
    }
}
exports.NewOrder = NewOrder;
//# sourceMappingURL=NewOrder.js.map