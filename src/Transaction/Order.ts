import {BaseOrder} from "./BaseOrder";
import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
import {IOrder} from "./Interfaces/IOrder";

export class Order extends BaseOrder {
	clientOrderId: string;
	executedQty: number;
	orderId: number;
	origQty: number;
	status: string;
	transactTime: number;

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

	constructor(symbol: string, price: string, side: string, executedQty: string, orderId: number,
							origQty: string, status: string, timeInForce: string, type: string, clientOrderId: string, transactTime: number) {
		super(parseFloat(price), side, symbol, type, timeInForce);
		this.executedQty = parseFloat(executedQty);
		this.orderId = orderId;
		this.origQty = parseFloat(origQty);
		this.status = EOrderStatus[status];
		this.clientOrderId = clientOrderId;
		this.transactTime = transactTime;
	}
}