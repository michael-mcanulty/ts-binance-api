"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const QueryOrder_1 = require("./QueryOrder");

class QueryCancelOrder extends QueryOrder_1.QueryOrder {
	constructor(symbol, orderId, recvWindow, origClientOrderId, newClientOrderId) {
		super(symbol, orderId, recvWindow, origClientOrderId);
		this.symbol = symbol;
		this.orderId = orderId;
		this.recvWindow = recvWindow;
		this.origClientOrderId = origClientOrderId;
		this.newClientOrderId = newClientOrderId;
	}
}

exports.QueryCancelOrder = QueryCancelOrder;
//# sourceMappingURL=QueryCancelOrder.js.map