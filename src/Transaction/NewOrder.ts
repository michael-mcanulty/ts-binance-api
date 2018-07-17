import {ENewOrderRespType, EOrderSide, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
import {INewOrder} from "./Interfaces/INewOrder";
import {Signed} from "../Rest/Signed";

export class NewOrder extends Signed implements INewOrder {

	public icebergQty?: number;
	public newClientOrderId?: string;
	public newOrderRespType?: string;
	public price?: number;
	public side: string;
	public quantity: number;
	public recvWindow?: number;
	public symbol: string;
	public stopPrice?: number;
	public timeInForce?: string;
	public type: string;

	constructor(quantity: number, side: EOrderSide, symbol: string, type: EOrderType, price?: number,
							icebergQty?: number, newClientOrderId?: string, stopPrice?: number,
							newOrderRespType?: ENewOrderRespType, recvWindow?: number, timeInForce?: ETimeInForce) {
		super();
		this.quantity = quantity;
		this.side = EOrderSide[side];
		this.symbol = symbol;
		this.type = EOrderType[type] || EOrderType[EOrderType.LIMIT];
		this.price = price;
		this.icebergQty = icebergQty;
		this.newOrderRespType = ENewOrderRespType[newOrderRespType] || ENewOrderRespType[ENewOrderRespType.RESULT];
		this.newClientOrderId = newClientOrderId;
		this.stopPrice = stopPrice;
		this.recvWindow = recvWindow || 5000;
		let goodTilCancelList: string[] = [EOrderType[EOrderType.LIMIT], EOrderType[EOrderType.STOP_LOSS_LIMIT], EOrderType[EOrderType.TAKE_PROFIT_LIMIT]];
		let isGoodTilCancelled: boolean = goodTilCancelList.includes(this.type);
		if (isGoodTilCancelled || !this.type) {
			this.timeInForce = ETimeInForce[ETimeInForce.GTC];
		}
	}
}