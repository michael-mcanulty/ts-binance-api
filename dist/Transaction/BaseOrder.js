"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Signed_1 = require("../Rest/Signed");
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class BaseOrder extends Signed_1.Signed {
    constructor(side, symbol, type, price, timeInForce) {
        super();
        this.price = price;
        this.side = side;
        this.symbol = symbol;
        this.type = type;
        this.price = price;
        let tForce;
        this.timeInForce = timeInForce;
        if (!timeInForce) {
            let goodTilCancelList = [EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.LIMIT], EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.STOP_LOSS_LIMIT], EOrderEnums_1.EOrderType[EOrderEnums_1.EOrderType.TAKE_PROFIT_LIMIT]];
            let isGoodTilCancelled = goodTilCancelList.includes(type);
            if (isGoodTilCancelled || !this.type) {
                this.timeInForce = EOrderEnums_1.ETimeInForce[EOrderEnums_1.ETimeInForce.GTC];
            }
        }
    }
}
exports.BaseOrder = BaseOrder;
//# sourceMappingURL=BaseOrder.js.map