import {IOpenOrder} from "./IOpenOrder";

export interface IQueryOrderResult extends IOpenOrder {
	isWorking: boolean;
}