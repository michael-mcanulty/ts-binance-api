"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Signed_1 = require("../Rest/Signed");
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");

class BaseOrder extends Signed_1.Signed {
	constructor(price, side, symbol, timeInForce, type) {
		super();
		this.price = parseFloat(price);
		this.side = EOrderEnums_1.EOrderSide[side];
		this.symbol = symbol;
		this.type = EOrderEnums_1.EOrderType[type];
		let tForce;
		this.timeInForce = EOrderEnums_1.ETimeInForce[timeInForce];
		if (!timeInForce) {
			let goodTilCancelList = [EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.LIMIT], EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.STOP_LOSS_LIMIT], EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.TAKE_PROFIT_LIMIT]];
			let isGoodTilCancelled = goodTilCancelList.includes(type);
			if (isGoodTilCancelled || !this.type) {
				tForce = EOrderEnums_1.ETimeInForce.GTC;
				this.timeInForce = tForce;
			}
		}
	}
}

exports.BaseOrder = BaseOrder;
//# sourceMappingURL=BaseOrder.js.map