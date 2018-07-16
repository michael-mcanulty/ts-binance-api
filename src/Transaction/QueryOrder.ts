import {IQueryOrder} from "./Interfaces/IQueryOrder";
import {Signed} from "../Rest/Signed";

export class QueryOrder extends Signed implements IQueryOrder {
	orderId?: string;
	origClientOrderId?: string;
	recvWindow?: number;
	symbol: string;
	timestamp: number;

	constructor(symbol: string, timestamp: number, orderId?: string, origClientOrderId?: string, recvWindow?: number) {
		super();
		this.symbol = symbol;
		this.timestamp = timestamp;
		this.orderId = orderId;
		this.origClientOrderId = origClientOrderId;
		this.recvWindow = recvWindow;
	}
}