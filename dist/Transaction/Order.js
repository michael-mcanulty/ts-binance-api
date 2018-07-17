"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOrder_1 = require("./BaseOrder");
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class Order extends BaseOrder_1.BaseOrder {
    static binanceFormat(iOrder) {
        let binance = {};
        binance.clientOrderId = iOrder.clientOrderId;
        binance.executedQty = iOrder.executedQty.toString();
        binance.isWorking = iOrder.isWorking;
        binance.orderId = iOrder.orderId;
        binance.origQty = iOrder.origQty.toString();
        binance.price = iOrder.price.toString();
        binance.side = EOrderEnums_1.EOrderSide[iOrder.side];
        binance.status = EOrderEnums_1.EOrderStatus[iOrder.status];
        binance.symbol = iOrder.symbol;
        binance.timeInForce = EOrderEnums_1.ETimeInForce[iOrder.timeInForce];
        binance.type = EOrderEnums_1.EOrderType[iOrder.type];
        return binance;
    }

	constructor(symbol, price, side, executedQty, orderId, origQty, status, timeInForce, type, clientOrderId, transactTime) {
		super(price, side, symbol, type, timeInForce);
        this.transactTime = transactTime;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map