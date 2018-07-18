import {IQueryCancelOrder} from "./Interfaces/IQueryCancelOrder";
import {QueryOrder} from "./QueryOrder";

export class CancelOrder extends QueryOrder implements IQueryCancelOrder {
	newClientOrderId?: string;

	constructor(symbol: string, orderId?: number, recvWindow?: number, origClientOrderId?: string, newClientOrderId?: string) {
		super(symbol, orderId, recvWindow, origClientOrderId);
		this.newClientOrderId = newClientOrderId;
	}
}