import {IMessage} from "./IMessage";

export interface IExecutionReport extends IMessage {
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
}
