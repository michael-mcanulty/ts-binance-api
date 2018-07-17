import {BaseQueryOrder} from "../BaseQueryOrder";

export interface IQueryAllOrders extends BaseQueryOrder {
	limit: number;
}