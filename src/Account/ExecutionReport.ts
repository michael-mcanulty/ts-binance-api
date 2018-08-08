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
	commission: number;
	commissionAsset: string;
	executionType: string;
	icebergQuantity: number;
	isBuyerMaker: boolean;
	isOrderWorking: boolean;
	lastTradeQuantity: number;
	newClientOrderId: string;
	orderId: number;
	orderRejectReason: string;
	orderStatus: string;
	orderTime: number;
	orderType: string;
	originalClientOrderId: string;
	price: number;
	priceLastTrade: number;
	quantity: number;
	side: string;
	stopPrice: number;
	symbol: string;
	timeInForce: string;
	totalTradeQuantity: number;
	tradeId: number;
	eventTime: number;
	eventType: string;

	public static fromBinanceStream(iExecReportRaw: IExecutionReportRaw): ExecutionReport {
		let result = new ExecutionReport(iExecReportRaw.n, iExecReportRaw.N, iExecReportRaw.E, iExecReportRaw.e, EExecutionType[iExecReportRaw.x],
			iExecReportRaw.F, iExecReportRaw.m, iExecReportRaw.w, iExecReportRaw.l, iExecReportRaw.c, iExecReportRaw.i, iExecReportRaw.r,
			EOrderStatus[iExecReportRaw.X], iExecReportRaw.T, EExecutionType[iExecReportRaw.x], iExecReportRaw.C,
			iExecReportRaw.p, iExecReportRaw.L, iExecReportRaw.q, EOrderSide[iExecReportRaw.S], iExecReportRaw.P, iExecReportRaw.s, ETimeInForce[iExecReportRaw.f],
			iExecReportRaw.z, iExecReportRaw.t);
		return result;
	}

	constructor(commission: string, commissionAsset: string, eventTime: number, eventType: string, executionType: EExecutionType,
							icebergQuantity: string, isBuyerMaker: boolean, isOrderWorking: boolean, lastTradeQuantity: string,
							newClientOrderId: string, orderId: number, orderRejectReason: string, orderStatus: EOrderStatus, orderTime: number,
							orderType: EOrderType, originalClientOrderId: string, price: string, priceLastTrade: string, quantity: string,
							side: EOrderSide, stopPrice: string, symbol: string, timeInForce: ETimeInForce, totalTradeQuantity: string, tradeId: number) {
		this.commission = parseFloat(commission);
		this.commissionAsset = commissionAsset;
		this.eventTime = eventTime;
		this.eventType = eventType;
		this.executionType = EExecutionType[executionType];
		this.icebergQuantity = parseFloat(icebergQuantity);
		this.isBuyerMaker = isBuyerMaker;
		this.isOrderWorking = isOrderWorking;
		this.lastTradeQuantity = parseFloat(lastTradeQuantity);
		this.newClientOrderId = newClientOrderId;
		this.orderId = orderId;
		this.orderRejectReason = orderRejectReason;
		this.orderStatus = EOrderStatus[orderStatus];
		this.orderTime = orderTime;
		this.orderType = EOrderType[orderType];
		this.originalClientOrderId = originalClientOrderId;
		this.price = parseFloat(price);
		this.priceLastTrade = parseFloat(priceLastTrade);
		this.quantity = parseFloat(quantity);
		this.side = EOrderSide[side];
		this.stopPrice = parseFloat(stopPrice);
		this.symbol = symbol;
		this.timeInForce = ETimeInForce[timeInForce];
		this.totalTradeQuantity = parseFloat(totalTradeQuantity);
		this.tradeId = tradeId;
	}
}
