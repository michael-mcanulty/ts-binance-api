import {eOrderSide, eOrderStatus} from "./eOrderEnums";

export interface iQueryOrderResult {
	clientOrderId: string;
	executedQty: string;
	icebergQty: string;
	isWorking: boolean;
	orderId: number;
	origQty: string;
	price: string;
	side: eOrderSide;
	status: eOrderStatus;
	stopPrice: string;
	symbol: string;
	time: number;
	timeInForce: string;
	type: string;
}