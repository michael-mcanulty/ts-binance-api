import {ENewOrderRespType, EOrderSide, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
import {INewOrder} from "./Interfaces/INewOrder";

export class NewOrder implements INewOrder {

	public icebergQty?: number;
	public newClientOrderId?: string;
	public newOrderRespType?: ENewOrderRespType;
	public price?: number;
	public side: EOrderSide;
	public quantity: number;
	public recvWindow?: number;
	public symbol: string;
	public stopPrice?: number;
	public type: EOrderType;
	public timeInForce?: ETimeInForce;

	constructor(quantity: number, side: EOrderSide, symbol: string, type: EOrderType,
							icebergQty?: number, newClientOrderId?: string, price?: number, stopPrice?: number,
							newOrderRespType?: ENewOrderRespType, recvWindow?: number, timeInForce?: ETimeInForce) {
		this.quantity = quantity;
		this.side = side;
		this.symbol = symbol;
		this.type = type || EOrderType.LIMIT;
		this.icebergQty = icebergQty;
		this.newOrderRespType = newOrderRespType || ENewOrderRespType.RESULT;
		this.newClientOrderId = newClientOrderId;
		this.price = price;
		this.stopPrice = stopPrice;
		this.recvWindow = recvWindow;
		let goodTilCancelList: EOrderType[] = [EOrderType.LIMIT, EOrderType.STOP_LOSS_LIMIT, EOrderType.TAKE_PROFIT_LIMIT];
		let isGoodTilCancelled: boolean = goodTilCancelList.includes(this.type);
		if (isGoodTilCancelled || !this.type) {
			this.timeInForce = ETimeInForce.GTC;
		}
	}
}