"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class Order {
	constructor(quantity, side, symbol, type, icebergQty, newClientOrderId, price, stopPrice, newOrderRespType, recvWindow, timeInForce) {
		this.quantity = quantity;
		this.side = side;
		this.symbol = symbol;
		this.type = type || EOrderEnums_1.EOrderType.LIMIT;
		this.icebergQty = icebergQty;
		this.newOrderRespType = newOrderRespType || EOrderEnums_1.ENewOrderRespType.RESULT;
		this.newClientOrderId = newClientOrderId;
		this.price = price;
		this.stopPrice = stopPrice;
		this.recvWindow = recvWindow;
		let goodTilCancelList = [EOrderEnums_1.EOrderType.LIMIT, EOrderEnums_1.EOrderType.STOP_LOSS_LIMIT, EOrderEnums_1.EOrderType.TAKE_PROFIT_LIMIT];
		let isGoodTilCancelled = goodTilCancelList.includes(this.type);
		if (isGoodTilCancelled || !this.type) {
			this.timeInForce = EOrderEnums_1.ETimeInForce.GTC;
		}
	}

	static marketBuy(symbol, quantity) {
		let type = EOrderEnums_1.EOrderType.MARKET;
		let side = EOrderEnums_1.EOrderSide.BUY;
		let newOrder = new Order(quantity, side, symbol, type);
		return newOrder;
    }

	static marketSell(symbol, quantity) {
		let type = EOrderEnums_1.EOrderType.MARKET;
		let side = EOrderEnums_1.EOrderSide.SELL;
		let newOrder = new Order(quantity, side, symbol, type);
		return newOrder;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map