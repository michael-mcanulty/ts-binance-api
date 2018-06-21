import {iExecutionReport} from "./Interfaces/iExecutionReport";
import {
	eExecutionType,
	eOrderSide,
	eOrderStatus,
	eOrderType,
	eTimeInForce
} from "../Transaction/Interfaces/eOrderEnums";
import {iExecutionReportRaw} from "./Interfaces/iExecutionReportRaw";

export class ExecutionReport implements iExecutionReport{
	commission: string;
	commissionAsset: string;
	executionType: eExecutionType;
	icebergQuantity: string;
	isBuyerMaker: boolean;
	isOrderWorking: boolean;
	lastTradeQuantity: string;
	newClientOrderId: string;
	orderId: number;
	orderRejectReason: string;
	orderStatus: eOrderStatus;
	orderTime: number;
	orderType: eOrderType;
	originalClientOrderId: string;
	price: string;
	priceLastTrade: string;
	quantity: string;
	side: eOrderSide;
	stopPrice: string;
	symbol: string;
	timeInForce: eTimeInForce;
	totalTradeQuantity: string;
	tradeId: number;
	eventTime: number;
	eventType: string;

	constructor(iExecReportRaw: iExecutionReportRaw ){
		let m = iExecReportRaw;
		let iExecReport: iExecutionReport = {
			eventType: 'executionReport',
			eventTime: m.E,
			symbol: m.s,
			newClientOrderId: m.c,
			originalClientOrderId: m.C,
			side: eOrderSide[m.S],
			orderType: eOrderType[m.o],
			timeInForce: eTimeInForce[m.f],
			quantity: m.q,
			price: m.p,
			executionType: eExecutionType[m.x],
			stopPrice: m.P,
			icebergQuantity: m.F,
			orderStatus: eOrderStatus[m.X],
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