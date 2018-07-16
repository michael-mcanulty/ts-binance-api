export interface INewOrder {
	icebergQty?: number;
	newClientOrderId?: string;
	newOrderRespType?: string;
	price?: number;
	side: string;
	quantity: number;
	recvWindow?: number;
	symbol: string;
	stopPrice?: number;
	timeInForce?: string;
	type: string;
}