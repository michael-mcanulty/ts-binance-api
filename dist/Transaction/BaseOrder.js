"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signed_1 = require("../Rest/Signed");
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class BaseOrder extends Signed_1.Signed {
    constructor(base) {
        super();
        this.price = base.price;
        this.side = base.side;
        this.symbol = base.symbol;
        this.type = EOrderEnums_1.EOrderType[base.type];
        this.timeInForce = base.timeInForce;
        if (!base.timeInForce) {
            let goodTilCancelList = [EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.LIMIT], EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.STOP_LOSS_LIMIT], EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.TAKE_PROFIT_LIMIT]];
            let isGoodTilCancelled = goodTilCancelList.includes(base.type);
            if (isGoodTilCancelled || !this.type) {
                this.timeInForce = EOrderEnums_1.ETimeInForce[EOrderEnums_1.ETimeInForce.GTC];
            }
        }
    }
}
exports.BaseOrder = BaseOrder;
//# sourceMappingURL=BaseOrder.js.map