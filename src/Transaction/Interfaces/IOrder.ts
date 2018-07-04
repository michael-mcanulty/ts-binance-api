import {IFill} from "./IFill";

export interface IOrder {
	clientOrderId: string;
	executedQty: string;
	fills?: IFill[];
	isWorking?: boolean;
	orderId: number;
	origQty: string;
	price: string;
	side: string;
	status: string;
	symbol: string;
	timeInForce: string;
	transactTime: number;
	type: string;
}