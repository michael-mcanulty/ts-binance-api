import {BaseOrder} from "./BaseOrder";
import {IOpenOrder} from "./Interfaces/IOpenOrder";
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
		let oOrder: IOpenOrder = <IOpenOrder>{};
		oOrder.clientOrderId = self.clientOrderId;
		oOrder.executedQty = (self.executedQty) ? self.executedQty.toString() : undefined;
		oOrder.icebergQty = (self.icebergQty) ? self.icebergQty.toString() : undefined;
		oOrder.isWorking = self.isWorking;
		oOrder.orderId = self.orderId;
		oOrder.origQty = (self.origQty) ? self.origQty.toString() : undefined;
		oOrder.price = (self.price) ? self.price.toString() : undefined;
		oOrder.side = self.side;
		oOrder.status = self.status;
		oOrder.stopPrice = (self.stopPrice) ? self.stopPrice.toString() : undefined;
		oOrder.symbol = self.symbol;
		oOrder.timeInForce = self.timeInForce;
		oOrder.time = self.time;
		oOrder.type = self.type;
		return oOrder;
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
		this.status = openOrder.status;
		this.icebergQty = parseFloat(openOrder.icebergQty);
		this.isWorking = openOrder.isWorking;
		this.stopPrice = parseFloat(openOrder.stopPrice);
		this.symbol = openOrder.symbol;
		this.time = openOrder.time;
	}
}
