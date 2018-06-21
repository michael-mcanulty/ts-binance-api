import {iFill} from "./iFill";

export interface iOrder {
	clientOrderId: string;
	executedQty: string;
	fills?: iFill[];
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