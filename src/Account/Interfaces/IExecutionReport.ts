import {IMessage} from "./IMessage";
import {
	EExecutionType,
	EOrderSide,
	EOrderStatus,
	EOrderType,
	ETimeInForce
} from "../../Transaction/Interfaces/EOrderEnums";

export interface IExecutionReport extends IMessage {
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
}
