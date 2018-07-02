"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const eOrderEnums_1 = require("../Transaction/Interfaces/eOrderEnums");
class ExecutionReport {
	constructor(iExecReportRaw) {
		let m = iExecReportRaw;
		let iExecReport = {
			eventType: 'executionReport',
			eventTime: m.E,
			symbol: m.s,
			newClientOrderId: m.c,
			originalClientOrderId: m.C,
			side: eOrderEnums_1.eOrderSide[m.S],
			orderType: eOrderEnums_1.eOrderType[m.o],
			timeInForce: eOrderEnums_1.eTimeInForce[m.f],
			quantity: m.q,
			price: m.p,
			executionType: eOrderEnums_1.eExecutionType[m.x],
			stopPrice: m.P,
			icebergQuantity: m.F,
			orderStatus: eOrderEnums_1.eOrderStatus[m.X],
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