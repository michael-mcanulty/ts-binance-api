import {IFill} from "./Interfaces/IFill";
import {IOrder} from "./Interfaces/IOrder";
import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";

export class Order {
	clientOrderId: string;
	executedQty: number;
	fills?: IFill[];
	orderId: number;
	origQty: number;
	price: number;
	side: EOrderSide;
	status: EOrderStatus;
	symbol: string;
	timeInForce: ETimeInForce;
	transactTime: number;
	type: EOrderType;

	public static fromDBFormat(orderInput: IOrder): Order {
		let result: Order = new Order(orderInput.symbol, orderInput.orderId, orderInput.clientOrderId, orderInput.transactTime, parseFloat(orderInput.price), parseFloat(orderInput.origQty), parseFloat(orderInput.executedQty), EOrderStatus[orderInput.status], ETimeInForce[orderInput.timeInForce], EOrderType[orderInput.type], EOrderSide[orderInput.side], orderInput.fills);
		return result;
	}

	public static toDBFormat(order: Order): IOrder {
		let result: IOrder = <IOrder>{};
		result.symbol = order.symbol;
		result.orderId = order.orderId;
		result.clientOrderId = order.clientOrderId;
		result.transactTime = order.transactTime;
		if (order.origQty !== null) {
			result.origQty = order.origQty.toString();
		}
		if (order.executedQty !== null) {
			result.executedQty = order.executedQty.toString();
		}
		if (order.price !== null) {
			result.price = order.price.toString();
		}
		result.timeInForce = ETimeInForce[order.timeInForce];
		result.type = EOrderType[order.type];
		result.side = EOrderSide[order.side];
		if (order.fills) {
			result.fills = order.fills;
		}
		return result;
	}

	constructor(symbol: string, orderId: number, clientOrderId: string, transactTime: number,
							price: number, origQty: number, executedQty: number, status: EOrderStatus,
							timeInForce: ETimeInForce, type: EOrderType, side: EOrderSide, fills?: IFill[]) {
		this.symbol = symbol;
		this.orderId = orderId;
		this.clientOrderId = clientOrderId;
		this.transactTime = transactTime;
		this.price = price;
		this.origQty = origQty;
		this.executedQty = executedQty;
		this.status = status;
		this.timeInForce = timeInForce;
		this.type = type;
		this.side = side;
		if (fills && fills.length > 0) {
			this.fills = fills;
		}
	}

}