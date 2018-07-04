import {IExecutionReport} from "./Interfaces/IExecutionReport";
import {
	EExecutionType,
	EOrderSide,
	EOrderStatus,
	EOrderType,
	ETimeInForce
} from "../Transaction/Interfaces/EOrderEnums";
import {IExecutionReportRaw} from "./Interfaces/IExecutionReportRaw";

export class ExecutionReport implements IExecutionReport {
	commission: string;
	commissionAsset: string;
	executionType: EExecutionType;
	icebergQuantity: string;
	isBuyerMaker: boolean;
	isOrderWorking: boolean;
	lastTradeQuantity: string;
	newClientOrderId: string;
	orderId: number;
	orderRejectReason: string;
	orderStatus: EOrderStatus;
	orderTime: number;
	orderType: EOrderType;
	originalClientOrderId: string;
	price: string;
	priceLastTrade: string;
	quantity: string;
	side: EOrderSide;
	stopPrice: string;
	symbol: string;
	timeInForce: ETimeInForce;
	totalTradeQuantity: string;
	tradeId: number;
	eventTime: number;
	eventType: string;

	constructor(iExecReportRaw: IExecutionReportRaw) {
		let m = iExecReportRaw;
		let iExecReport: IExecutionReport = {
			eventType: 'executionReport',
			eventTime: m.E,
			symbol: m.s,
			newClientOrderId: m.c,
			originalClientOrderId: m.C,
			side: EOrderSide[m.S],
			orderType: EOrderType[m.o],
			timeInForce: ETimeInForce[m.f],
			quantity: m.q,
			price: m.p,
			executionType: EExecutionType[m.x],
			stopPrice: m.P,
			icebergQuantity: m.F,
			orderStatus: EOrderStatus[m.X],
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