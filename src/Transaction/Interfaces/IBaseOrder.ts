import {Signed} from "../../Rest/Signed";

export interface IBaseOrder extends Signed {
	price: string;
	side: string;
	symbol: string;
	timeInForce: string;
	cummulativeQuoteQty: string;
	type: string;
}