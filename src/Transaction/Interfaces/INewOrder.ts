import {EOrderSide, EOrderType, ETimeInForce} from "./EOrderEnums";

export interface INewOrder {
	icebergQty?: string;
	newClientOrderId?: string;
	price?: string;
	quantity: string;
	recvWindow?: number;
	side: EOrderSide;
	stopPrice?: string;
	symbol: string;
	timeInForce?: ETimeInForce;
	type: EOrderType;
	useServerTime?: boolean;
}