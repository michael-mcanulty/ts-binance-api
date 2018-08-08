import {BaseOrder} from "./BaseOrder";
import {IOpenOrder} from "./Interfaces/IOpenOrder";
import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";

export class OpenOrder extends BaseOrder {
	clientOrderId: string;
	executedQty: number;
	icebergQty: number;
	isWorking: boolean;
	orderId: number;
	origQty: number;
	status: string;
	stopPrice: number;
	time: number;

	static toBinance(openOrder: OpenOrder): IOpenOrder {
		let binance: IOpenOrder = <IOpenOrder>{};
		binance.clientOrderId = openOrder.clientOrderId;
		binance.executedQty = (openOrder.executedQty) ? openOrder.executedQty.toString() : undefined;
		binance.icebergQty = (openOrder.icebergQty) ? openOrder.icebergQty.toString() : undefined;
		binance.isWorking = openOrder.isWorking;
		binance.orderId = openOrder.orderId;
		binance.origQty = (openOrder.origQty) ? openOrder.origQty.toString() : undefined;
		binance.price = (openOrder.price) ? openOrder.price.toString() : undefined;
		binance.side = EOrderSide[openOrder.side];
		binance.status = EOrderStatus[openOrder.status];
		binance.stopPrice = (openOrder.stopPrice) ? openOrder.stopPrice.toString() : undefined;
		binance.symbol = openOrder.symbol;
		binance.timeInForce = ETimeInForce[openOrder.timeInForce];
		binance.time = openOrder.time;
		binance.type = EOrderType[openOrder.type];
		return binance;
	}

	constructor(clientOrderId: string, executedQty: string, orderId: number, origQty: string,
							price: string, side: string, status: string, symbol: string, type: string,
							timeInForce: string, icebergQty: string, isWorking: boolean, stopPrice: string, time: number) {
		super(parseFloat(price), side, symbol, type, timeInForce);
		this.clientOrderId = clientOrderId;
		this.executedQty = parseFloat(executedQty);
		this.orderId = orderId;
		this.status = status;
		this.icebergQty = parseFloat(icebergQty);
		this.isWorking = isWorking;
		this.stopPrice = parseFloat(stopPrice);
		this.symbol = symbol;
		this.time = time;
	}
}
