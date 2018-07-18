import {ICancelOrderResponse} from "./Interfaces/ICancelOrderResponse";

export class CancelOrderResponse implements ICancelOrderResponse {
	clientOrderId: string;
	orderId: number;
	origClientOrderId: string;
	symbol: string;

	constructor(result: ICancelOrderResponse) {
		Object.assign(this, result);
	}
}