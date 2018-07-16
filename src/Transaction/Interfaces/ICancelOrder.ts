export interface ICancelOrder {
	newClientOrderId?: string;
	orderId?: string;
	origClientOrderId?: string;
	recvWindow?: number;
	symbol: string;
	timestamp: number;
}