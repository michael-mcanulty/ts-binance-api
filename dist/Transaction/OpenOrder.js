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
        let oOrder = {};
        oOrder.clientOrderId = self.clientOrderId;
        oOrder.executedQty = (self.executedQty) ? self.executedQty.toString() : undefined;
        oOrder.icebergQty = (self.icebergQty) ? self.icebergQty.toString() : undefined;
        oOrder.isWorking = self.isWorking;
        oOrder.orderId = self.orderId;
        oOrder.origQty = (self.origQty) ? self.origQty.toString() : undefined;
        oOrder.price = (self.price) ? self.price.toString() : undefined;
        oOrder.side = self.side;
        oOrder.status = self.status;
        oOrder.stopPrice = (self.stopPrice) ? self.stopPrice.toString() : undefined;
        oOrder.symbol = self.symbol;
        oOrder.timeInForce = self.timeInForce;
        oOrder.time = self.time;
        oOrder.type = self.type;
        return oOrder;
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
        this.status = openOrder.status;
        this.icebergQty = parseFloat(openOrder.icebergQty);
        this.isWorking = openOrder.isWorking;
        this.stopPrice = parseFloat(openOrder.stopPrice);
        this.symbol = openOrder.symbol;
        this.time = openOrder.time;
    }
}
exports.OpenOrder = OpenOrder;
//# sourceMappingURL=OpenOrder.js.map