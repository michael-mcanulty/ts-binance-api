"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Signed_1 = require("../Rest/Signed");

class QueryOpenOrder extends Signed_1.Signed {
	constructor(symbol, orderId, recvWindow, origClientOrderId) {
		super();
		this.symbol = symbol;
		this.orderId = orderId;
		this.recvWindow = recvWindow;
		this.origClientOrderId = origClientOrderId;
	}
}

exports.QueryOpenOrder = QueryOpenOrder;
//# sourceMappingURL=QueryOpenOrder.js.map