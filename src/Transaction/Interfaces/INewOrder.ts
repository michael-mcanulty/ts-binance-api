import {IBaseOrder} from "./IBaseOrder";

export interface INewOrder extends IBaseOrder {
	icebergQty?: number;
	newClientOrderId?: string;
	newOrderRespType?: string;
	quantity: number;
	recvWindow?: number;
	stopPrice?: number;
}