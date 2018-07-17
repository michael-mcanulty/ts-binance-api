import {BaseOrder} from "./BaseOrder";
import {EOrderSide, EOrderStatus, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
import {IOrder} from "./Interfaces/IOrder";

export class Order extends BaseOrder {
	clientOrderId: string;
	executedQty: number;
	orderId: number;
	origQty: number;
	transactTime: number;
	status: EOrderStatus;

	static binanceFormat(iOrder: IOrder): IOrder {
		let binance: IOrder = <IOrder>{};
		binance.clientOrderId = iOrder.clientOrderId;
		binance.executedQty = iOrder.executedQty.toString();
		binance.isWorking = iOrder.isWorking;
		binance.orderId = iOrder.orderId;
		binance.origQty = iOrder.origQty.toString();
		binance.price = iOrder.price.toString();
		binance.side = EOrderSide[iOrder.side];
		binance.status = EOrderStatus[iOrder.status];
		binance.symbol = iOrder.symbol;
		binance.timeInForce = ETimeInForce[iOrder.timeInForce];
		binance.type = EOrderType[iOrder.type];
		return binance;
	}

	constructor(clientOrderId: string, executedQty: string, orderId: number,
							origQty: string, price: string, side: string, status: string,
							symbol: string, timeInForce: string, type: string,
							transactTime: number) {
		super(price, side, symbol, timeInForce, type);
		this.transactTime = transactTime;
	}
}