"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var EOrderType;
(function (EOrderType) {
	EOrderType[EOrderType["LIMIT"] = 0] = "LIMIT";
	EOrderType[EOrderType["MARKET"] = 1] = "MARKET";
	EOrderType[EOrderType["STOP_LOSS"] = 2] = "STOP_LOSS";
	EOrderType[EOrderType["STOP_LOSS_LIMIT"] = 3] = "STOP_LOSS_LIMIT";
	EOrderType[EOrderType["TAKE_PROFIT"] = 4] = "TAKE_PROFIT";
	EOrderType[EOrderType["TAKE_PROFIT_LIMIT"] = 5] = "TAKE_PROFIT_LIMIT";
	EOrderType[EOrderType["LIMIT_MAKER"] = 6] = "LIMIT_MAKER";
})(EOrderType = exports.EOrderType || (exports.EOrderType = {}));
var EOrderStatus;
(function (EOrderStatus) {
	EOrderStatus[EOrderStatus["NEW"] = 0] = "NEW";
	EOrderStatus[EOrderStatus["PARTIALLY_FILLED"] = 1] = "PARTIALLY_FILLED";
	EOrderStatus[EOrderStatus["FILLED"] = 2] = "FILLED";
	EOrderStatus[EOrderStatus["CANCELED"] = 3] = "CANCELED";
	EOrderStatus[EOrderStatus["PENDING_CANCEL"] = 4] = "PENDING_CANCEL";
	EOrderStatus[EOrderStatus["REJECTED"] = 5] = "REJECTED";
	EOrderStatus[EOrderStatus["EXPIRED"] = 6] = "EXPIRED";
})(EOrderStatus = exports.EOrderStatus || (exports.EOrderStatus = {}));
var EOrderSide;
(function (EOrderSide) {
	EOrderSide[EOrderSide["BUY"] = 0] = "BUY";
	EOrderSide[EOrderSide["SELL"] = 1] = "SELL";
})(EOrderSide = exports.EOrderSide || (exports.EOrderSide = {}));
var ETimeInForce;
(function (ETimeInForce) {
	ETimeInForce[ETimeInForce["GTC"] = 0] = "GTC";
	ETimeInForce[ETimeInForce["IOC"] = 1] = "IOC";
	ETimeInForce[ETimeInForce["FOK"] = 2] = "FOK";
})(ETimeInForce = exports.ETimeInForce || (exports.ETimeInForce = {}));
var EExecutionType;
(function (EExecutionType) {
	EExecutionType[EExecutionType["NEW"] = 0] = "NEW";
	EExecutionType[EExecutionType["CANCELED"] = 1] = "CANCELED";
	EExecutionType[EExecutionType["REPLACED"] = 2] = "REPLACED";
	EExecutionType[EExecutionType["REJECTED"] = 3] = "REJECTED";
	EExecutionType[EExecutionType["TRADE"] = 4] = "TRADE";
	EExecutionType[EExecutionType["EXPIRED"] = 5] = "EXPIRED";
})(EExecutionType = exports.EExecutionType || (exports.EExecutionType = {}));
var ENewOrderRespType;
(function (ENewOrderRespType) {
	ENewOrderRespType[ENewOrderRespType["ACK"] = 0] = "ACK";
	ENewOrderRespType[ENewOrderRespType["RESULT"] = 1] = "RESULT";
	ENewOrderRespType[ENewOrderRespType["FULL"] = 2] = "FULL";
})(ENewOrderRespType = exports.ENewOrderRespType || (exports.ENewOrderRespType = {}));
//# sourceMappingURL=EOrderEnums.js.map