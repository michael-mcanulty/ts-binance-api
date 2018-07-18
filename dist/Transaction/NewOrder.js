"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
const BaseOrder_1 = require("./BaseOrder");
class NewOrder extends BaseOrder_1.BaseOrder {
	constructor(symbol, quantity, side, type, price, icebergQty, timeInForce, stopPrice, recvWindow, newClientOrderId, newOrderRespType) {
		super(price, EOrderEnums_1.EOrderSide[side], symbol, EOrderEnums_1.EOrderType[type], EOrderEnums_1.ETimeInForce[timeInForce]);
        this.quantity = quantity;
		this.icebergQty = icebergQty;
        this.newOrderRespType = EOrderEnums_1.ENewOrderRespType[newOrderRespType] || EOrderEnums_1.ENewOrderRespType[EOrderEnums_1.ENewOrderRespType.RESULT];
        this.newClientOrderId = newClientOrderId;
		this.stopPrice = stopPrice;
        this.recvWindow = recvWindow || 5000;
    }

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
}
exports.NewOrder = NewOrder;
//# sourceMappingURL=NewOrder.js.map