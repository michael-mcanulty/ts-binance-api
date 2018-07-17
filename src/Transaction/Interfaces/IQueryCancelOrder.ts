import {IQueryOrder} from "./IQueryOrder";

export interface IQueryCancelOrder extends IQueryOrder {
	newClientOrderId?: string;
}