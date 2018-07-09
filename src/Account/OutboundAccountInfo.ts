import {IBalanceRaw, IOutboundAccountInfoRaw} from "./Interfaces/IOutboundAccountInfoRaw";
import {Balance} from "../Balances/Balance";

export class OutboundAccountInfo{
	balances: Balance[];
	buyerCommissionRate: number;
	canDeposit: boolean;
	canTrade: boolean;
	canWithdraw: boolean;
	eventTime: number;
	eventType: string;
	lastAccountUpdate: number;
	makerCommissionRate: number;
	sellerCommissionRate: number;
	takerCommissionRate: number;

	public static fromBinanceApi(iOutInfoRaw: IOutboundAccountInfoRaw): OutboundAccountInfo {
		let outbound: OutboundAccountInfo = new OutboundAccountInfo(iOutInfoRaw.B, iOutInfoRaw.b, iOutInfoRaw.D, iOutInfoRaw.T, iOutInfoRaw.W,
			iOutInfoRaw.E, iOutInfoRaw.u, iOutInfoRaw.m, iOutInfoRaw.s, iOutInfoRaw.t);
		return outbound;
	}

	constructor(balances: IBalanceRaw[], buyerCommissionRate: number, canDeposit: boolean, canTrade: boolean,
							canWithdraw: boolean, eventTime: number, lastAccountUpdate: number,
							makerCommissionRate: number, sellerCommissionRate: number, takerCommissionRate: number) {
		this.balances = balances.map((bal: IBalanceRaw) => {
			return new Balance(bal.a, bal.f, bal.l);
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
}