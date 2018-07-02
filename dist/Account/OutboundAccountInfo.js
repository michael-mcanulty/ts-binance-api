"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
class OutboundAccountInfo {
	constructor(iOutAccountInfoRaw) {
		let m = iOutAccountInfoRaw;
		let conversion = {
			eventType: 'account',
			eventTime: m.E,
			makerCommissionRate: m.m,
			takerCommissionRate: m.t,
			buyerCommissionRate: m.b,
			sellerCommissionRate: m.s,
			canTrade: m.T,
			canWithdraw: m.W,
			canDeposit: m.D,
			lastAccountUpdate: m.u,
			balances: m.B.reduce((out, cur) => {
				out[cur.a] = {available: cur.f, locked: cur.l};
				return out;
			}, {}),
		};
		Object.assign(this, conversion);
	}
}
exports.OutboundAccountInfo = OutboundAccountInfo;
//# sourceMappingURL=OutboundAccountInfo.js.map