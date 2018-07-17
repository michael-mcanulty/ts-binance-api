export interface INewOpenOrder {
	orderId?: number;
	origClientOrderId?: string;
	recvWindow?: number;
	symbol: string;
}