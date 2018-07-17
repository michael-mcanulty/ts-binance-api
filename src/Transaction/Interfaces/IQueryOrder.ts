export interface IQueryOrder {
	orderId?: number;
	origClientOrderId?: string;
	recvWindow?: number;
	symbol: string;
}