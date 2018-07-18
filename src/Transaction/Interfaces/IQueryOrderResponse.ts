import {IOpenOrder} from "./IOpenOrder";

export interface IQueryOrderResponse extends IOpenOrder {
	isWorking: boolean;
}