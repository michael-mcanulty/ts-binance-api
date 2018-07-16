"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signed_1 = require("../Rest/Signed");

class Order extends Signed_1.Signed {
	constructor(orderRaw) {
		super();
		Object.assign(this, orderRaw);
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map