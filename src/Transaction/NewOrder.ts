import {ENewOrderRespType, EOrderSide, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
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

	constructor(symbol: string, quantity: number, side: EOrderSide, type: EOrderType, price?: number,
							icebergQty?: number, timeInForce?: ETimeInForce, stopPrice?: number, recvWindow?: number, newClientOrderId?: string, newOrderRespType?: ENewOrderRespType) {
		super(price, EOrderSide[side], symbol, EOrderType[type], ETimeInForce[timeInForce]);
		this.quantity = quantity;
		this.icebergQty = icebergQty;
		this.newOrderRespType = ENewOrderRespType[newOrderRespType] || ENewOrderRespType[ENewOrderRespType.RESULT];
		this.newClientOrderId = newClientOrderId;
		this.stopPrice = stopPrice;
		this.recvWindow = recvWindow || 5000;
	}
}