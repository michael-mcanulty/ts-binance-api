import {IOutboundAccountInfoStream} from "./Interfaces/IOutboundAccountInfoStream";
import {Balance} from "../Balances/Balance";
import {IOutboundAccountInfoRest} from "./Interfaces/IOutboundAccountInfoRest";
import {IBalanceRest} from "../Balances/Interfaces/IBalanceRest";
import {IBalanceStream} from "../Balances/Interfaces/IBalanceStream";

export class OutboundAccountInfo {
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

	public static fromBinanceRest(account: IOutboundAccountInfoRest): OutboundAccountInfo {
		let balances: Balance[] = account.balances.map((bal: IBalanceRest) => {
			return new Balance(bal.asset, bal.free, bal.locked);
		});

		let outbound: OutboundAccountInfo = new OutboundAccountInfo(balances, account.buyerCommissionRate,
			account.canDeposit, account.canTrade, account.canWithdraw, account.eventTime, account.lastAccountUpdate,
			account.makerCommissionRate, account.sellerCommissionRate, account.takerCommissionRate);
		return outbound;
	}

	public static fromBinanceStream(iOutInfoRaw: IOutboundAccountInfoStream): OutboundAccountInfo {
		let balances: Balance[] = iOutInfoRaw.B.map((bal: IBalanceStream) => {
			return new Balance(bal.a, bal.f, bal.l);
		});
		let outbound: OutboundAccountInfo;
		outbound = new OutboundAccountInfo(balances, iOutInfoRaw.b, iOutInfoRaw.D, iOutInfoRaw.T, iOutInfoRaw.W, iOutInfoRaw.E, iOutInfoRaw.u, iOutInfoRaw.m, iOutInfoRaw.s, iOutInfoRaw.t);
		return outbound;
	}

	constructor(balances: Balance[], buyerCommissionRate: number, canDeposit: boolean, canTrade: boolean, canWithdraw: boolean, eventTime: number, lastAccountUpdate: number, makerCommissionRate: number, sellerCommissionRate: number, takerCommissionRate: number) {
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
}