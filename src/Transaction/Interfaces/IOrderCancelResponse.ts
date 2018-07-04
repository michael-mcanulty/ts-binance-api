export interface IOrderCancelResponse {
	clientOrderId: string;
	orderId: number;
	origClientOrderId: string;
	symbol: string;
}