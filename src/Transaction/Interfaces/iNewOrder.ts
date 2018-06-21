import {eOrderSide, eOrderType, eTimeInForce} from "./eOrderEnums";

export interface iNewOrder {
	icebergQty?: string;
	newClientOrderId?: string;
	price?: string;
	quantity: string;
	recvWindow?: number;
	side: eOrderSide;
	stopPrice?: string;
	symbol: string;
	timeInForce?: eTimeInForce;
	type: eOrderType;
	useServerTime?: boolean;
}