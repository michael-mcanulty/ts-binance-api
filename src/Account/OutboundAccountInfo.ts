import {IOutboundAccountInfo} from "./Interfaces/IOutboundAccountInfo";
import {IBinanceBalances} from "../ExchangeInfo/Interfaces/IBinanceBalances";
import {IOutboundAccountInfoRaw} from "./Interfaces/IOutboundAccountInfoRaw";

export class OutboundAccountInfo{
	balances: IBinanceBalances;
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

	constructor(iOutAccountInfoRaw: IOutboundAccountInfoRaw) {
		let m = iOutAccountInfoRaw;
		let conversion: IOutboundAccountInfo = {
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
			out[cur.a] = { available: cur.f, locked: cur.l }
			return out
			}, {}),
		};
		Object.assign(this, conversion);
	}
}