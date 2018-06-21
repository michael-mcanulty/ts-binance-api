import {iFill} from "./Interfaces/iFill";
import {iOrder} from "./Interfaces/iOrder";
import {eOrderSide, eOrderStatus, eOrderType, eTimeInForce} from "./Interfaces/eOrderEnums";

export class Order {
	clientOrderId: string;
	executedQty: number;
	fills?: iFill[];
	orderId: number;
	origQty: number;
	price: number;
	side: eOrderSide;
	status: eOrderStatus;
	symbol: string;
	timeInForce: eTimeInForce;
	transactTime: number;
	type: eOrderType;

	public static fromDBFormat(orderInput: iOrder): Order {
		let result: Order = new Order(orderInput.symbol, orderInput.orderId, orderInput.clientOrderId, orderInput.transactTime, parseFloat(orderInput.price), parseFloat(orderInput.origQty), parseFloat(orderInput.executedQty), eOrderStatus[orderInput.status], eTimeInForce[orderInput.timeInForce], eOrderType[orderInput.type], eOrderSide[orderInput.side], orderInput.fills);
		return result;
	}

	public static toDBFormat(order: Order): iOrder {
		let result: iOrder = <iOrder>{};
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
		result.timeInForce = eTimeInForce[order.timeInForce];
		result.type = eOrderType[order.type];
		result.side = eOrderSide[order.side];
		if (order.fills) {
			result.fills = order.fills;
		}
		return result;
	}

	constructor(symbol: string, orderId: number, clientOrderId: string, transactTime: number,
							price: number, origQty: number, executedQty: number, status: eOrderStatus,
							timeInForce: eTimeInForce, type: eOrderType, side: eOrderSide, fills?: iFill[]) {
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