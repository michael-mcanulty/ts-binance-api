import {I24hrTicker} from "./I24hrTicker";

export interface ITicker extends I24hrTicker{
	askQty: string;
	bidQty: string;
}
