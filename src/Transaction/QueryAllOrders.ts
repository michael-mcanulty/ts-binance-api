import {BaseQueryOrder} from "./BaseQueryOrder";
import {IQueryAllOrders} from "./Interfaces/IQueryAllOrders";

export class QueryAllOrders extends BaseQueryOrder implements IQueryAllOrders {
	limit: number;

	constructor(symbol: string, orderId: number, limit: number, recvWindow?: number) {
		super(symbol, orderId, recvWindow);
	}
}