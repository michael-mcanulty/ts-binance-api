"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Signed_1 = require("../Rest/Signed");
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class Order extends Signed_1.Signed {
	constructor(orderRaw) {
		super();
		this.clientOrderId = orderRaw.clientOrderId;
		this.executedQty = parseFloat(orderRaw.executedQty);
		this.orderId = orderRaw.orderId;
		this.origQty = parseFloat(orderRaw.origQty);
		this.price = parseFloat(orderRaw.price);
		this.side = EOrderEnums_1.EOrderSide[orderRaw.side];
		this.status = EOrderEnums_1.EOrderStatus[orderRaw.status];
		this.symbol = orderRaw.symbol;
		this.timeInForce = EOrderEnums_1.ETimeInForce[orderRaw.timeInForce];
		this.transactTime = orderRaw.transactTime;
		this.type = EOrderEnums_1.EOrderType[orderRaw.type];
	}
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map