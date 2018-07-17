import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
import {IOpenOrder} from "./Interfaces/IOpenOrder";
import {Signed} from "../Rest/Signed";

export class OpenOrder extends Signed {
	static allOpenOrders: OpenOrder[] = [];
	clientOrderId: string;
	executedQty: number;
	icebergQty: number;
	isWorking: boolean;
	orderId: number;
	origQty: number;
	price: number;
	side: EOrderSide;
	status: EOrderStatus;
	stopPrice: number;
	symbol: string;
	time: number;
	timeInForce: ETimeInForce;
	type: EOrderType;

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

	constructor(iOpenOrderRes: IOpenOrder) {
		super();
		this.clientOrderId = iOpenOrderRes.clientOrderId;
		this.executedQty = parseFloat(iOpenOrderRes.executedQty);
		this.icebergQty = parseFloat(iOpenOrderRes.icebergQty);
		this.isWorking = iOpenOrderRes.isWorking;
		this.orderId = iOpenOrderRes.orderId;
		this.origQty = parseFloat(iOpenOrderRes.origQty);
		this.price = parseFloat(iOpenOrderRes.price);
		this.side = EOrderSide[iOpenOrderRes.side];
		this.status = EOrderStatus[iOpenOrderRes.status];
		this.stopPrice = parseFloat(iOpenOrderRes.stopPrice);
		this.symbol = iOpenOrderRes.symbol;
		this.time = iOpenOrderRes.time;
		this.timeInForce = ETimeInForce[iOpenOrderRes.timeInForce];
		this.type = EOrderType[iOpenOrderRes.type];
	}
}