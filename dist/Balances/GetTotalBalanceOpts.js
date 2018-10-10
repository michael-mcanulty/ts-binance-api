"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetTotalBalanceOpts {
    toObjLiteral() {
        let self = this;
        let order = {};
        for (let prop in self) {
            if (self[prop] && typeof self[prop] !== "function") {
                order[prop] = self[prop];
            }
        }
        return order;
    }
    constructor(opts) {
        this.usdAsset = opts.usdAsset || "USDT";
        this.xChangeRatioBA = opts.xChangeRatioBA || "BTC";
        this.quoteAsset = opts.quoteAsset || this.xChangeRatioBA;
        this.recvWindow = opts.recvWindow || 60000;
    }
}
exports.GetTotalBalanceOpts = GetTotalBalanceOpts;
//# sourceMappingURL=GetTotalBalanceOpts.js.map