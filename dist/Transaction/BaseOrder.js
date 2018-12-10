"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signed_1 = require("../Rest/Signed");
class BaseOrder extends Signed_1.Signed {
    constructor(base) {
        super();
        this.price = base.price;
        this.side = base.side;
        this.symbol = base.symbol;
        this.type = base.type;
        this.timeInForce = base.timeInForce;
        if (!base.timeInForce) {
            let goodTilCancelList = ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'];
            let isGoodTilCancelled = goodTilCancelList.includes(base.type);
            if (isGoodTilCancelled || !this.type) {
                this.timeInForce = 'GTC';
            }
        }
    }
}
exports.BaseOrder = BaseOrder;
//# sourceMappingURL=BaseOrder.js.map