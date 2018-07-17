import {Signed} from "../Rest/Signed";

export class BaseQueryOrder extends Signed {
	orderId: number;
	recvWindow: number;
	symbol: string;

	constructor(symbol: string, orderId: number, recvWindow?: number) {
		super();
		this.symbol = symbol;
		this.orderId = orderId;
		this.recvWindow = recvWindow;
	}
}