import {INewOpenOrder} from "./Interfaces/INewOpenOrder";
import {Signed} from "../Rest/Signed";

export class NewOpenOrder extends Signed implements INewOpenOrder {
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