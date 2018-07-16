import {IOrder} from "./Interfaces/IOrder";
import {Signed} from "../Rest/Signed";

export class Order extends Signed implements IOrder {
	clientOrderId: string;
	executedQty: string;
	orderId: number;
	origQty: string;
	price: string;
	side: string;
	status: string;
	symbol: string;
	timeInForce: string;
	transactTime: number;
	type: string;

	constructor(orderRaw: IOrder) {
		super();
		Object.assign(this, orderRaw);
	}
}