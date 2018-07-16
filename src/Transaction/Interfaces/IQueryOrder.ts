export interface IQueryOrder {
	orderId?: string;
	origClientOrderId?: string;
	recvWindow?: number;
	symbol: string;
	timestamp: number;
}