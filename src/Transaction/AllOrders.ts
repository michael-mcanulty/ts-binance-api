import {BaseQueryOrder} from "./BaseQueryOrder";
import {IAllOrders} from "./Interfaces/IAllOrders";

export class AllOrders extends BaseQueryOrder implements IAllOrders {
	limit: number;

	constructor(symbol: string, orderId: number, limit: number, recvWindow?: number) {
		super(symbol, orderId, recvWindow);
	}
}