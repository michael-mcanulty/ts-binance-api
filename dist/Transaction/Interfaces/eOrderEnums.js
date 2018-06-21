"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eOrderType;
(function (eOrderType) {
    eOrderType[eOrderType["LIMIT"] = 0] = "LIMIT";
    eOrderType[eOrderType["MARKET"] = 1] = "MARKET";
    eOrderType[eOrderType["STOP_LOSS"] = 2] = "STOP_LOSS";
    eOrderType[eOrderType["STOP_LOSS_LIMIT"] = 3] = "STOP_LOSS_LIMIT";
    eOrderType[eOrderType["TAKE_PROFIT"] = 4] = "TAKE_PROFIT";
    eOrderType[eOrderType["TAKE_PROFIT_LIMIT"] = 5] = "TAKE_PROFIT_LIMIT";
    eOrderType[eOrderType["LIMIT_MAKER"] = 6] = "LIMIT_MAKER";
})(eOrderType = exports.eOrderType || (exports.eOrderType = {}));
var eOrderStatus;
(function (eOrderStatus) {
    eOrderStatus[eOrderStatus["NEW"] = 0] = "NEW";
    eOrderStatus[eOrderStatus["PARTIALLY_FILLED"] = 1] = "PARTIALLY_FILLED";
    eOrderStatus[eOrderStatus["FILLED"] = 2] = "FILLED";
    eOrderStatus[eOrderStatus["CANCELED"] = 3] = "CANCELED";
    eOrderStatus[eOrderStatus["PENDING_CANCEL"] = 4] = "PENDING_CANCEL";
    eOrderStatus[eOrderStatus["REJECTED"] = 5] = "REJECTED";
    eOrderStatus[eOrderStatus["EXPIRED"] = 6] = "EXPIRED";
})(eOrderStatus = exports.eOrderStatus || (exports.eOrderStatus = {}));
var eOrderSide;
(function (eOrderSide) {
    eOrderSide[eOrderSide["BUY"] = 0] = "BUY";
    eOrderSide[eOrderSide["SELL"] = 1] = "SELL";
})(eOrderSide = exports.eOrderSide || (exports.eOrderSide = {}));
var eTimeInForce;
(function (eTimeInForce) {
    eTimeInForce[eTimeInForce["GTC"] = 0] = "GTC";
    eTimeInForce[eTimeInForce["IOC"] = 1] = "IOC";
    eTimeInForce[eTimeInForce["FOK"] = 2] = "FOK";
})(eTimeInForce = exports.eTimeInForce || (exports.eTimeInForce = {}));
var eExecutionType;
(function (eExecutionType) {
    eExecutionType[eExecutionType["NEW"] = 0] = "NEW";
    eExecutionType[eExecutionType["CANCELED"] = 1] = "CANCELED";
    eExecutionType[eExecutionType["REPLACED"] = 2] = "REPLACED";
    eExecutionType[eExecutionType["REJECTED"] = 3] = "REJECTED";
    eExecutionType[eExecutionType["TRADE"] = 4] = "TRADE";
    eExecutionType[eExecutionType["EXPIRED"] = 5] = "EXPIRED";
})(eExecutionType = exports.eExecutionType || (exports.eExecutionType = {}));
//# sourceMappingURL=eOrderEnums.js.map