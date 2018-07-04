"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class Order {
	constructor(symbol, orderId, clientOrderId, transactTime, price, origQty, executedQty, status, timeInForce, type, side, fills) {
		this.symbol = symbol;
		this.orderId = orderId;
		this.clientOrderId = clientOrderId;
		this.transactTime = transactTime;
		this.price = price;
		this.origQty = origQty;
		this.executedQty = executedQty;
		this.status = status;
		this.timeInForce = timeInForce;
		this.type = type;
		this.side = side;
		if (fills && fills.length > 0) {
			this.fills = fills;
		}
	}

    static fromDBFormat(orderInput) {
			let result = new Order(orderInput.symbol, orderInput.orderId, orderInput.clientOrderId, orderInput.transactTime, parseFloat(orderInput.price), parseFloat(orderInput.origQty), parseFloat(orderInput.executedQty), EOrderEnums_1.EOrderStatus[orderInput.status], EOrderEnums_1.ETimeInForce[orderInput.timeInForce], EOrderEnums_1.EOrderType[orderInput.type], EOrderEnums_1.EOrderSide[orderInput.side], orderInput.fills);
        return result;
    }

    static toDBFormat(order) {
        let result = {};
        result.symbol = order.symbol;
        result.orderId = order.orderId;
        result.clientOrderId = order.clientOrderId;
        result.transactTime = order.transactTime;
        if (order.origQty !== null) {
            result.origQty = order.origQty.toString();
        }
        if (order.executedQty !== null) {
            result.executedQty = order.executedQty.toString();
        }
        if (order.price !== null) {
            result.price = order.price.toString();
        }
			result.timeInForce = EOrderEnums_1.ETimeInForce[order.timeInForce];
			result.type = EOrderEnums_1.EOrderType[order.type];
			result.side = EOrderEnums_1.EOrderSide[order.side];
        if (order.fills) {
            result.fills = order.fills;
        }
        return result;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map