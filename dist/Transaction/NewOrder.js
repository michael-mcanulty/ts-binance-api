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
        let binance = {};
        binance.quantity = (newOrder.quantity) ? newOrder.quantity : undefined;
        binance.icebergQty = (newOrder.icebergQty) ? newOrder.icebergQty : undefined;
        binance.price = (newOrder.price) ? newOrder.price : undefined;
        binance.side = newOrder.side;
        binance.stopPrice = (newOrder.stopPrice) ? newOrder.stopPrice : undefined;
        binance.symbol = newOrder.symbol;
        binance.timeInForce = newOrder.timeInForce;
        binance.type = newOrder.type;
        return binance;
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