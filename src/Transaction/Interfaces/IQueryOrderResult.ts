import {EOrderSide, EOrderStatus} from "./EOrderEnums";

export interface IQueryOrderResult {
	clientOrderId: string;
	executedQty: string;
	icebergQty: string;
	isWorking: boolean;
	orderId: number;
	origQty: string;
	price: string;
	side: EOrderSide;
	status: EOrderStatus;
	stopPrice: string;
	symbol: string;
	time: number;
	timeInForce: string;
	type: string;
}