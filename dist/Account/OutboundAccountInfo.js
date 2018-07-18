"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Balance_1 = require("../Balances/Balance");
class OutboundAccountInfo {
	constructor(balances, buyerCommissionRate, canDeposit, canTrade, canWithdraw, eventTime, lastAccountUpdate, makerCommissionRate, sellerCommissionRate, takerCommissionRate) {
		this.balances = balances;
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

	static fromBinanceRest(account) {
		let balances = account.balances.map((bal) => {
			return new Balance_1.Balance(bal.asset, bal.free, bal.locked);
		});
		let outbound = new OutboundAccountInfo(balances, account.buyerCommissionRate, account.canDeposit, account.canTrade, account.canWithdraw, account.eventTime, account.lastAccountUpdate, account.makerCommissionRate, account.sellerCommissionRate, account.takerCommissionRate);
		return outbound;
	}

	static fromBinanceStream(iOutInfoRaw) {
		let balances = iOutInfoRaw.B.map((bal) => {
			return new Balance_1.Balance(bal.a, bal.f, bal.l);
		});
		let outbound = new OutboundAccountInfo(balances, iOutInfoRaw.b, iOutInfoRaw.D, iOutInfoRaw.T, iOutInfoRaw.W, iOutInfoRaw.E, iOutInfoRaw.u, iOutInfoRaw.m, iOutInfoRaw.s, iOutInfoRaw.t);
		return outbound;
	}
}
exports.OutboundAccountInfo = OutboundAccountInfo;
//# sourceMappingURL=OutboundAccountInfo.js.map