import {IOrder} from "./Interfaces/IOrder";
import {BaseOrder} from "./BaseOrder";
import {Fill} from "./Fill";

export class Order extends BaseOrder {
	clientOrderId: string;
	executedQty: number;
	orderId: number;
	origQty: number;
	status: string;
	transactTime: number;
	price: string;
	side: string;
	symbol: string;
	timeInForce: string;
	type: string;
	fills?: Fill[];

	static toBinance(order: Order): IOrder {
		let nOrder: IOrder = <IOrder>{};
		nOrder.clientOrderId = order.clientOrderId;
		nOrder.executedQty = (order.executedQty) ? order.executedQty.toString() : undefined;
		nOrder.orderId = order.orderId;
		nOrder.origQty = (order.origQty) ? order.origQty.toString() : undefined;
		nOrder.price = (order.price) ? order.price.toString() : undefined;
		nOrder.side = order.side;
		nOrder.status = order.status;
		nOrder.symbol = order.symbol;
		nOrder.timeInForce = order.timeInForce;
		nOrder.type = order.type;
		return nOrder;
	}

	constructor(order: IOrder) {
		super(order);
		this.executedQty = parseFloat(order.executedQty);
		this.orderId = order.orderId;
		this.origQty = parseFloat(order.origQty);
		this.status = order.status;
		this.clientOrderId = order.clientOrderId;
		this.transactTime = order.transactTime;
	}
}