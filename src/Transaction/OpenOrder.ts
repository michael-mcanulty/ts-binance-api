import {BaseOrder} from "./BaseOrder";
import {IOpenOrder} from "./Interfaces/IOpenOrder";
import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
import {IBaseOrder} from "../Transaction/Interfaces/IBaseOrder";

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

	constructor(openOrder: IOpenOrder) {
		let base: IBaseOrder = <IBaseOrder>{};
		base.cummulativeQuoteQty = openOrder.cummulativeQuoteQty;
		base.type = openOrder.type;
		base.price = openOrder.price;
		base.side = openOrder.side;
		base.symbol = openOrder.symbol;
		base.timeInForce = openOrder.timeInForce;
		super(base);
		this.clientOrderId = openOrder.clientOrderId;
		this.executedQty = parseFloat(openOrder.executedQty);
		this.orderId = openOrder.orderId;
		this.status = status;
		this.icebergQty = parseFloat(openOrder.icebergQty);
		this.isWorking = openOrder.isWorking;
		this.stopPrice = parseFloat(openOrder.stopPrice);
		this.symbol = openOrder.symbol;
		this.time = openOrder.time;
	}
}
