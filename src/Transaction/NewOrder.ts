import {ENewOrderRespType} from "./Interfaces/EOrderEnums";
import {BaseOrder} from "./BaseOrder";
import {INewOrder} from "./Interfaces/INewOrder";

export class NewOrder extends BaseOrder {

	icebergQty?: number;
	newClientOrderId?: string;
	newOrderRespType?: string;
	quantity: number;
	recvWindow?: number;
	stopPrice?: number;

	public toObjLiteral(): INewOrder{
		let self: NewOrder = this;
		let order: INewOrder = <INewOrder>{};
		for (let prop in self){
			if (self[prop] && typeof self[prop] !== "function") {
				order[prop] = self[prop];
			}
		}
		return order;
	}

	static toBinance(newOrder: NewOrder): INewOrder {
		let nOrder: INewOrder = <INewOrder>{};
		nOrder.quantity = (newOrder.quantity) ? newOrder.quantity : undefined;
		nOrder.icebergQty = (newOrder.icebergQty) ? newOrder.icebergQty : undefined;
		nOrder.price = (newOrder.price) ? newOrder.price : undefined;
		nOrder.side = newOrder.side;
		nOrder.stopPrice = (newOrder.stopPrice) ? newOrder.stopPrice : undefined;
		nOrder.symbol = newOrder.symbol;
		nOrder.timeInForce = newOrder.timeInForce;
		nOrder.type = newOrder.type;
		return nOrder;
	}

	constructor(newOrder: INewOrder){
		super(newOrder);
		this.quantity = newOrder.quantity;
		this.icebergQty = newOrder.icebergQty;
		this.newOrderRespType = newOrder.newOrderRespType || 'FULL';
		this.newClientOrderId = newOrder.newClientOrderId;
		this.stopPrice = newOrder.stopPrice;
		this.recvWindow = newOrder.recvWindow || 5000;
	}
}