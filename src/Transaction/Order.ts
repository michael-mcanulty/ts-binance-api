import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
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
		let binance: IOrder = <IOrder>{};
		binance.clientOrderId = order.clientOrderId;
		binance.executedQty = (order.executedQty) ? order.executedQty.toString() : undefined;
		binance.orderId = order.orderId;
		binance.origQty = (order.origQty) ? order.origQty.toString() : undefined;
		binance.price = (order.price) ? order.price.toString() : undefined;
		binance.side = order.side;
		binance.status = order.status;
		binance.symbol = order.symbol;
		binance.timeInForce = order.timeInForce;
		binance.type = order.type;
		return binance;
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