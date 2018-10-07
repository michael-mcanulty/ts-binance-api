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

	public toObjLiteral(): IOpenOrder{
		let self: OpenOrder = this;
		let order: IOpenOrder = <IOpenOrder>{};
		for (let prop in self){
			if (self[prop] && typeof self[prop] !== "function") {
				order[prop] = self[prop];
			}
		}
		return order;
	}

	public toBinance(): IOpenOrder {
		let self: OpenOrder = this;
		let binance: IOpenOrder = <IOpenOrder>{};
		binance.clientOrderId = self.clientOrderId;
		binance.executedQty = (self.executedQty) ? self.executedQty.toString() : undefined;
		binance.icebergQty = (self.icebergQty) ? self.icebergQty.toString() : undefined;
		binance.isWorking = self.isWorking;
		binance.orderId = self.orderId;
		binance.origQty = (self.origQty) ? self.origQty.toString() : undefined;
		binance.price = (self.price) ? self.price.toString() : undefined;
		binance.side = self.side;
		binance.status = self.status;
		binance.stopPrice = (self.stopPrice) ? self.stopPrice.toString() : undefined;
		binance.symbol = self.symbol;
		binance.timeInForce = self.timeInForce;
		binance.time = self.time;
		binance.type = self.type;
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
