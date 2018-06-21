import {iMessage} from "./iMessage";
import {
	eExecutionType,
	eOrderSide,
	eOrderStatus,
	eOrderType,
	eTimeInForce
} from "../../Transaction/Interfaces/eOrderEnums";

export interface iExecutionReport extends iMessage {
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
}
