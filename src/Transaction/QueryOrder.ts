import {IQueryOrder} from "./Interfaces/IQueryOrder";
import {Signed} from "../Rest/Signed";

export class QueryOrder extends Signed implements IQueryOrder {
	orderId: number;
	origClientOrderId: string;
	recvWindow: number;
	symbol: string;

	constructor(symbol: string, orderId: number, recvWindow?: number, origClientOrderId?: string) {
		super();
		this.symbol = symbol;
		this.orderId = orderId;
		this.recvWindow = recvWindow;
		this.origClientOrderId = origClientOrderId;
	}
}