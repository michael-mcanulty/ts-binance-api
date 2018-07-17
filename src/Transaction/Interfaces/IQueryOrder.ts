import {IBaseQueryOrder} from "./IBaseQueryOrder";

export interface IQueryOrder extends IBaseQueryOrder {
	origClientOrderId?: string;
}