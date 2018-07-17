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

	static binanceFormat(newOrder: INewOrder): INewOrder {
		let binance: INewOrder = <INewOrder>{};
		binance.icebergQty = newOrder.icebergQty;
		binance.price = newOrder.price;
		binance.side = EOrderSide[newOrder.side];
		binance.stopPrice = newOrder.stopPrice;
		binance.symbol = newOrder.symbol;
		binance.timeInForce = ETimeInForce[newOrder.timeInForce];
		binance.type = EOrderType[newOrder.type];
		return binance;
	}

	constructor(clientOrderId: string, executedQty: string, orderId: number, origQty: string,
							price: string, side: string, status: string, symbol: string, timeInForce: string, type: string, quantity: number,
							icebergQty?: string, stopPrice?: string, recvWindow?: number, newClientOrderId?: string, newOrderRespType?: string) {
		super(price, side, symbol, timeInForce, type);
		this.quantity = quantity;
		this.icebergQty = parseFloat(icebergQty);
		this.newOrderRespType = ENewOrderRespType[newOrderRespType] || ENewOrderRespType[ENewOrderRespType.RESULT];
		this.newClientOrderId = newClientOrderId;
		this.stopPrice = parseFloat(stopPrice);
		this.recvWindow = recvWindow || 5000;
	}
}