import {ENewOrderRespType, EOrderSide, EOrderType, ETimeInForce} from "./EOrderEnums";

export interface INewOrder {
	icebergQty?: number;
	newClientOrderId?: string;
	newOrderRespType?: ENewOrderRespType;
	price?: number;
	side: EOrderSide;
	quantity: number;
	recvWindow?: number;
	symbol: string;
	stopPrice?: number;
	type: EOrderType;
	timeInForce?: ETimeInForce;
}