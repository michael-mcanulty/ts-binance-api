"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const BaseQueryOrder_1 = require("./BaseQueryOrder");

class QueryOrder extends BaseQueryOrder_1.BaseQueryOrder {
	constructor(symbol, orderId, recvWindow, origClientOrderId) {
		super(symbol, orderId, recvWindow);
		this.origClientOrderId = origClientOrderId;
	}
}
exports.QueryOrder = QueryOrder;
//# sourceMappingURL=QueryOrder.js.map