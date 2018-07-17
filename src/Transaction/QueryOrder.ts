import {IQueryOrder} from "./Interfaces/IQueryOrder";
import {BaseQueryOrder} from "./BaseQueryOrder";

export class QueryOrder extends BaseQueryOrder implements IQueryOrder {
	origClientOrderId: string;

	constructor(symbol: string, orderId: number, recvWindow?: number, origClientOrderId?: string) {
		super(symbol, orderId, recvWindow);
		this.origClientOrderId = origClientOrderId;
	}
}