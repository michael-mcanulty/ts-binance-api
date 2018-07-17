export interface INewCancelOrder {
	newClientOrderId?: string;
	orderId?: number;
	origClientOrderId?: string;
	recvWindow?: number;
	symbol: string;
	timestamp: number;
}