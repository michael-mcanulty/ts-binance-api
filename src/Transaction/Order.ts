import {IOrder} from "./Interfaces/IOrder";
import {Signed} from "../Rest/Signed";
import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";

export class Order extends Signed {
	clientOrderId: string;
	executedQty: number;
	orderId: number;
	origQty: number;
	price: number;
	side: EOrderSide;
	status: EOrderStatus;
	symbol: string;
	timeInForce: ETimeInForce;
	transactTime: number;
	type: EOrderType;

	constructor(orderRaw: IOrder) {
		super();
		this.clientOrderId = orderRaw.clientOrderId;
		this.executedQty = parseFloat(orderRaw.executedQty);
		this.orderId = orderRaw.orderId;
		this.origQty = parseFloat(orderRaw.origQty);
		this.price = parseFloat(orderRaw.price);
		this.side = EOrderSide[orderRaw.side];
		this.status = EOrderStatus[orderRaw.status];
		this.symbol = orderRaw.symbol;
		this.timeInForce = ETimeInForce[orderRaw.timeInForce];
		this.transactTime = orderRaw.transactTime;
		this.type = EOrderType[orderRaw.type];
	}
}