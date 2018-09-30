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
	price: number;
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
		binance.side = EOrderSide[order.side];
		binance.status = EOrderStatus[order.status];
		binance.symbol = order.symbol;
		binance.timeInForce = ETimeInForce[order.timeInForce];
		binance.type = EOrderType[order.type];
		return binance;
	}

	constructor(order: IOrder) {
		super(order.side, order.symbol, order.type, parseFloat(order.price), order.timeInForce);
		this.executedQty = parseFloat(order.executedQty);
		this.orderId = order.orderId;
		this.origQty = parseFloat(order.origQty);
		this.status = EOrderStatus[order.status];
		this.clientOrderId = order.clientOrderId;
		this.transactTime = order.transactTime;
	}
}