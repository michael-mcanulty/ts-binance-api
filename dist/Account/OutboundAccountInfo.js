"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Balance_1 = require("../Balances/Balance");
class OutboundAccountInfo {
	constructor(balances, buyerCommissionRate, canDeposit, canTrade, canWithdraw, eventTime, lastAccountUpdate, makerCommissionRate, sellerCommissionRate, takerCommissionRate) {
		this.balances = balances.map((bal) => {
			return new Balance_1.Balance(bal.a, bal.f, bal.l);
		});
		this.buyerCommissionRate = buyerCommissionRate;
		this.canDeposit = canDeposit;
		this.canTrade = canTrade;
		this.canWithdraw = canWithdraw;
		this.eventType = "account";
		this.eventTime = eventTime;
		this.lastAccountUpdate = lastAccountUpdate;
		this.makerCommissionRate = makerCommissionRate;
		this.sellerCommissionRate = sellerCommissionRate;
		this.takerCommissionRate = takerCommissionRate;
	}

	static fromBinanceApi(iOutInfoRaw) {
		let outbound = new OutboundAccountInfo(iOutInfoRaw.B, iOutInfoRaw.b, iOutInfoRaw.D, iOutInfoRaw.T, iOutInfoRaw.W, iOutInfoRaw.E, iOutInfoRaw.u, iOutInfoRaw.m, iOutInfoRaw.s, iOutInfoRaw.t);
		return outbound;
	}
}
exports.OutboundAccountInfo = OutboundAccountInfo;
//# sourceMappingURL=OutboundAccountInfo.js.map