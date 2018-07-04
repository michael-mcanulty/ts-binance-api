"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const EOrderEnums_1 = require("../Transaction/Interfaces/EOrderEnums");
class ExecutionReport {
	constructor(iExecReportRaw) {
		let m = iExecReportRaw;
		let iExecReport = {
			eventType: 'executionReport',
			eventTime: m.E,
			symbol: m.s,
			newClientOrderId: m.c,
			originalClientOrderId: m.C,
			side: EOrderEnums_1.EOrderSide[m.S],
			orderType: EOrderEnums_1.EOrderType[m.o],
			timeInForce: EOrderEnums_1.ETimeInForce[m.f],
			quantity: m.q,
			price: m.p,
			executionType: EOrderEnums_1.EExecutionType[m.x],
			stopPrice: m.P,
			icebergQuantity: m.F,
			orderStatus: EOrderEnums_1.EOrderStatus[m.X],
			orderRejectReason: m.r,
			orderId: m.i,
			orderTime: m.T,
			lastTradeQuantity: m.l,
			totalTradeQuantity: m.z,
			priceLastTrade: m.L,
			commission: m.n,
			commissionAsset: m.N,
			tradeId: m.t,
			isOrderWorking: m.w,
			isBuyerMaker: m.m,
		};
		Object.assign(this, iExecReport);
	}
}
exports.ExecutionReport = ExecutionReport;
//# sourceMappingURL=ExecutionReport.js.map