import {ISigned} from "../../Rest/Interfaces/ISigned";

export interface IBaseOrder extends ISigned {
	price: string;
	side: string;
	symbol: string;
	timeInForce: string;
	cummulativeQuoteQty: string;
	type: string;
}