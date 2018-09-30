"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
const BaseOrder_1 = require("./BaseOrder");
class NewOrder extends BaseOrder_1.BaseOrder {
    static toBinance(newOrder) {
        let binance = {};
        binance.quantity = (newOrder.quantity) ? newOrder.quantity.toString() : undefined;
        binance.icebergQty = (newOrder.icebergQty) ? newOrder.icebergQty.toString() : undefined;
        binance.price = (newOrder.price) ? newOrder.price.toString() : undefined;
        binance.side = newOrder.side;
        binance.stopPrice = (newOrder.stopPrice) ? newOrder.stopPrice.toString() : undefined;
        binance.symbol = newOrder.symbol;
        binance.timeInForce = newOrder.timeInForce;
        binance.type = newOrder.type;
        return binance;
    }
    constructor(newOrder) {
        super(newOrder.side, newOrder.symbol, newOrder.type, parseFloat(newOrder.price), newOrder.timeInForce);
        this.quantity = parseFloat(newOrder.quantity);
        this.icebergQty = parseFloat(newOrder.icebergQty);
        this.newOrderRespType = EOrderEnums_1.ENewOrderRespType[newOrder.newOrderRespType] || EOrderEnums_1.ENewOrderRespType[EOrderEnums_1.ENewOrderRespType.FULL];
        this.newClientOrderId = newOrder.newClientOrderId;
        this.stopPrice = parseFloat(newOrder.stopPrice);
        this.recvWindow = newOrder.recvWindow || 5000;
    }
}
exports.NewOrder = NewOrder;
//# sourceMappingURL=NewOrder.js.map