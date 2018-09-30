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

	static toBinance(newOrder: NewOrder): INewOrder {
		let binance: INewOrder = <INewOrder>{};
		binance.quantity = (newOrder.quantity) ? newOrder.quantity.toString() : undefined;
		binance.icebergQty = (newOrder.icebergQty) ? newOrder.icebergQty.toString() : undefined;
		binance.price = (newOrder.price) ? newOrder.price.toString() : undefined;
		binance.side = newOrder.side;
		binance.stopPrice = (newOrder.stopPrice) ? newOrder.stopPrice.toString() : undefined;
		binance.symbol = newOrder.symbol;
		binance.timeInForce = newOrder.timeInForce;
		binance.type = newOrder.type;
		return binance;
	}

	constructor(newOrder: INewOrder){
		super(newOrder.side, newOrder.symbol, newOrder.type, parseFloat(newOrder.price), newOrder.timeInForce)
		this.quantity = parseFloat(newOrder.quantity);
		this.icebergQty = parseFloat(newOrder.icebergQty);
		this.newOrderRespType = ENewOrderRespType[newOrder.newOrderRespType] || ENewOrderRespType[ENewOrderRespType.FULL];
		this.newClientOrderId = newOrder.newClientOrderId;
		this.stopPrice = parseFloat(newOrder.stopPrice);
		this.recvWindow = newOrder.recvWindow || 5000;
	}
}