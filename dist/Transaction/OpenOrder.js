"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
const Signed_1 = require("../Rest/Signed");
class OpenOrder extends Signed_1.Signed {
	constructor(iOpenOrderRes) {
		super();
		this.clientOrderId = iOpenOrderRes.clientOrderId;
		this.executedQty = parseFloat(iOpenOrderRes.executedQty);
		this.icebergQty = parseFloat(iOpenOrderRes.icebergQty);
		this.isWorking = iOpenOrderRes.isWorking;
		this.orderId = iOpenOrderRes.orderId;
		this.origQty = parseFloat(iOpenOrderRes.origQty);
		this.price = parseFloat(iOpenOrderRes.price);
		this.side = EOrderEnums_1.EOrderSide[iOpenOrderRes.side];
		this.status = EOrderEnums_1.EOrderStatus[iOpenOrderRes.status];
		this.stopPrice = parseFloat(iOpenOrderRes.stopPrice);
		this.symbol = iOpenOrderRes.symbol;
		this.time = iOpenOrderRes.time;
		this.timeInForce = EOrderEnums_1.ETimeInForce[iOpenOrderRes.timeInForce];
		this.type = EOrderEnums_1.EOrderType[iOpenOrderRes.type];
	}

	static cancelOrderById(orderId) {
		let boolRes = false;
		let allOrderIds;
		let removeIdx;
		if (OpenOrder.allOpenOrders.length > 0) {
			allOrderIds = OpenOrder.allOpenOrders.map(order => order.orderId);
			removeIdx = allOrderIds.indexOf(orderId);
			if (removeIdx >= 0) {
				OpenOrder.allOpenOrders.splice(removeIdx, 1);
				boolRes = true;
			}
		}
		return boolRes;
	}

	static cancelOrdersBySymbol(symbol) {
		let boolResArr = [];
		let res = false;
		let cancelIds;
		if (OpenOrder.allOpenOrders.length > 0) {
			cancelIds = OpenOrder.allOpenOrders.filter(o => o.symbol === symbol).map(o => o.orderId);
			if (cancelIds.length > 0) {
				cancelIds.forEach(id => {
					boolResArr.push(OpenOrder.cancelOrderById(id));
				});
				res = boolResArr.every(b => b === true);
			}
		}
		return res;
	}
}
OpenOrder.allOpenOrders = [];
exports.OpenOrder = OpenOrder;
//# sourceMappingURL=OpenOrder.js.map