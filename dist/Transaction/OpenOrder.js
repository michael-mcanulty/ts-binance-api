"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOrder_1 = require("./BaseOrder");
class OpenOrder extends BaseOrder_1.BaseOrder {
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
    toBinance() {
        let self = this;
        let binance = {};
        binance.clientOrderId = self.clientOrderId;
        binance.executedQty = (self.executedQty) ? self.executedQty.toString() : undefined;
        binance.icebergQty = (self.icebergQty) ? self.icebergQty.toString() : undefined;
        binance.isWorking = self.isWorking;
        binance.orderId = self.orderId;
        binance.origQty = (self.origQty) ? self.origQty.toString() : undefined;
        binance.price = (self.price) ? self.price.toString() : undefined;
        binance.side = self.side;
        binance.status = self.status;
        binance.stopPrice = (self.stopPrice) ? self.stopPrice.toString() : undefined;
        binance.symbol = self.symbol;
        binance.timeInForce = self.timeInForce;
        binance.time = self.time;
        binance.type = self.type;
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