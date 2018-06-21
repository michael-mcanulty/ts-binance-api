import {iOutboundAccountInfo} from "./Interfaces/iOutboundAccountInfo";
import {iBinanceBalances} from "../ExchangeInfo/Interfaces/iBinanceBalances";
import {iOutboundAccountInfoRaw} from "./Interfaces/iOutboundAccountInfoRaw";

export class OutboundAccountInfo{
	balances: iBinanceBalances;
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

	constructor(iOutAccountInfoRaw:iOutboundAccountInfoRaw){
		let m = iOutAccountInfoRaw;
		let conversion:iOutboundAccountInfo = {
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