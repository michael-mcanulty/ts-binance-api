export interface IOpenOrder {
	clientOrderId: string;
	executedQty: string;
	icebergQty: string;
	isWorking: boolean;
	orderId: number;
	origQty: string;
	price: string;
	side: string;
	status: string;
	stopPrice: string;
	symbol: string;
	time: number;
	timeInForce: string;
	type: string;
}