import {ICancelOrder} from "./Interfaces/ICancelOrder";
import {Signed} from "../Rest/Signed";

export class CancelOrder extends Signed implements ICancelOrder {
	newClientOrderId?: string;
	orderId?: string;
	origClientOrderId?: string;
	recvWindow?: number;
	symbol: string;
	timestamp: number;

	constructor(symbol: string, newClientOrderId?: string, orderId?: string, origClientOrderId?: string, recvWindow?: number) {
		super();
		this.symbol = symbol;
		this.timestamp = new Date().getTime();
		this.newClientOrderId = newClientOrderId;
		this.orderId = orderId;
		this.origClientOrderId = origClientOrderId;
		this.recvWindow = recvWindow;
	}
}