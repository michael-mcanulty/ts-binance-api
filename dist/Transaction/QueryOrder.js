"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Signed_1 = require("../Rest/Signed");

class QueryOrder extends Signed_1.Signed {
	constructor(symbol, orderId, recvWindow, origClientOrderId) {
		super();
		this.symbol = symbol;
		this.orderId = orderId;
		this.recvWindow = recvWindow;
		this.origClientOrderId = origClientOrderId;
	}
}

exports.QueryOrder = QueryOrder;
//# sourceMappingURL=QueryOrder.js.map