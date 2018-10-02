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
		let binance: INewOrder = <INewOrder>{};
		binance.quantity = (newOrder.quantity) ? newOrder.quantity : undefined;
		binance.icebergQty = (newOrder.icebergQty) ? newOrder.icebergQty : undefined;
		binance.price = (newOrder.price) ? newOrder.price : undefined;
		binance.side = newOrder.side;
		binance.stopPrice = (newOrder.stopPrice) ? newOrder.stopPrice : undefined;
		binance.symbol = newOrder.symbol;
		binance.timeInForce = newOrder.timeInForce;
		binance.type = newOrder.type;
		return binance;
	}

	constructor(newOrder: INewOrder){
		super(newOrder);
		this.quantity = newOrder.quantity;
		this.icebergQty = newOrder.icebergQty;
		this.newOrderRespType = ENewOrderRespType[newOrder.newOrderRespType] || ENewOrderRespType[ENewOrderRespType.FULL];
		this.newClientOrderId = newOrder.newClientOrderId;
		this.stopPrice = newOrder.stopPrice;
		this.recvWindow = newOrder.recvWindow || 5000;
	}
}