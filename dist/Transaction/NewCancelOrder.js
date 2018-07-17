"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Signed_1 = require("../Rest/Signed");

class NewCancelOrder extends Signed_1.Signed {
	constructor(symbol, orderId, newClientOrderId, origClientOrderId, recvWindow) {
		super();
		this.symbol = symbol;
		this.orderId = orderId;
		this.timestamp = new Date().getTime();
		this.newClientOrderId = newClientOrderId;
		this.origClientOrderId = origClientOrderId;
		this.recvWindow = recvWindow;
	}
}

exports.NewCancelOrder = NewCancelOrder;
//# sourceMappingURL=NewCancelOrder.js.map