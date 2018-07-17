import {INewCancelOrder} from "./Interfaces/INewCancelOrder";
import {Signed} from "../Rest/Signed";

export class NewCancelOrder extends Signed implements INewCancelOrder {
	newClientOrderId?: string;
	orderId?: number;
	origClientOrderId?: string;
	recvWindow?: number;
	symbol: string;
	timestamp: number;

	constructor(symbol: string, orderId?: number, newClientOrderId?: string, origClientOrderId?: string, recvWindow?: number) {
		super();
		this.symbol = symbol;
		this.orderId = orderId;
		this.timestamp = new Date().getTime();
		this.newClientOrderId = newClientOrderId;
		this.origClientOrderId = origClientOrderId;
		this.recvWindow = recvWindow;
	}
}