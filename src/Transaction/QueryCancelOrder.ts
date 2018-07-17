import {IQueryCancelOrder} from "./Interfaces/IQueryCancelOrder";
import {QueryOrder} from "./QueryOrder";

export class QueryCancelOrder extends QueryOrder implements IQueryCancelOrder {
	newClientOrderId?: string;

	constructor(symbol: string, orderId?: number, recvWindow?: number, origClientOrderId?: string, newClientOrderId?: string) {
		super(symbol, orderId, recvWindow, origClientOrderId);
		this.symbol = symbol;
		this.orderId = orderId;
		this.recvWindow = recvWindow;
		this.origClientOrderId = origClientOrderId;
		this.newClientOrderId = newClientOrderId;
	}
}