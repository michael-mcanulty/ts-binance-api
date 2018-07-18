import {BaseOrder} from "./BaseOrder";
import {IOpenOrder} from "./Interfaces/IOpenOrder";
import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";

export class OpenOrder extends BaseOrder {
	static allOpenOrders: OpenOrder[] = [];
	clientOrderId: string;
	executedQty: number;
	icebergQty: number;
	isWorking: boolean;
	status: string;
	orderId: number;
	origQty: number;
	stopPrice: number;
	time: number;

	static cancelOrderById(orderId: number): boolean {
		let boolRes: boolean = false;
		let allOrderIds: number[];
		let removeIdx: number;
		if (OpenOrder.allOpenOrders.length > 0) {
			allOrderIds = OpenOrder.allOpenOrders.map(order => order.orderId);
			removeIdx = allOrderIds.indexOf(orderId);
			if (removeIdx >= 0) {
				OpenOrder.allOpenOrders.splice(removeIdx, 1);
				boolRes = true;
			}
		}
		return boolRes;
	}

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

	static cancelOrdersBySymbol(symbol: string): boolean {
		let boolResArr: boolean[] = [];
		let res: boolean = false;
		let cancelIds: number[];
		if (OpenOrder.allOpenOrders.length > 0) {
			cancelIds = OpenOrder.allOpenOrders.filter(o => o.symbol === symbol).map(o => o.orderId);
			if (cancelIds.length > 0) {
				cancelIds.forEach(id => {
					boolResArr.push(OpenOrder.cancelOrderById(id));
				});
				res = boolResArr.every(b => b === true);
			}
		}
		return res;
	}

	constructor(clientOrderId: string, executedQty: string, orderId: number, origQty: string,
							price: string, side: string, status: string, symbol: string, type: string,
							timeInForce: string, icebergQty: string, isWorking: boolean, stopPrice: string, time: number) {
		super(parseFloat(price), side, symbol, type, timeInForce);
		this.icebergQty = parseFloat(icebergQty);
		this.isWorking = isWorking;
		this.stopPrice = parseFloat(stopPrice);
		this.symbol = symbol;
		this.time = time;
	}
}
