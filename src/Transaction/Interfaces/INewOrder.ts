import {IBaseOrder} from "./IBaseOrder";

export interface INewOrder extends IBaseOrder {
	icebergQty?: string;
	newClientOrderId?: string;
	newOrderRespType?: string;
	quantity: string;
	recvWindow?: number;
	stopPrice?: string;
}