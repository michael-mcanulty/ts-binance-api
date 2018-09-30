export interface IGetAllOrdersOpts {
	symbol: string;
	limit?: number;
	orderId?: number;
	recvWindow?: number;
	startTime?: number;
	endTime?:number;
}