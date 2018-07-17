"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
const Signed_1 = require("../Rest/Signed");

class NewOrder extends Signed_1.Signed {
	constructor(quantity, side, symbol, type, price, icebergQty, newClientOrderId, stopPrice, newOrderRespType, recvWindow, timeInForce) {
		super();
		this.quantity = quantity;
		this.side = EOrderEnums_1.EOrderSide[side];
		this.symbol = symbol;
		this.type = EOrderEnums_1.EOrderType[type] || EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.LIMIT];
		this.price = price;
		this.icebergQty = icebergQty;
		this.newOrderRespType = EOrderEnums_1.ENewOrderRespType[newOrderRespType] || EOrderEnums_1.ENewOrderRespType[EOrderEnums_1.ENewOrderRespType.RESULT];
		this.newClientOrderId = newClientOrderId;
		this.stopPrice = stopPrice;
		this.recvWindow = recvWindow || 5000;
		let goodTilCancelList = [EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.LIMIT], EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.STOP_LOSS_LIMIT], EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.TAKE_PROFIT_LIMIT]];
		let isGoodTilCancelled = goodTilCancelList.includes(this.type);
		if (isGoodTilCancelled || !this.type) {
			this.timeInForce = EOrderEnums_1.ETimeInForce[EOrderEnums_1.ETimeInForce.GTC];
		}
	}
}

exports.NewOrder = NewOrder;
//# sourceMappingURL=NewOrder.js.map