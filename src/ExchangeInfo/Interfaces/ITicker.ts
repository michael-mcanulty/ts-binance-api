import {I24hrTickerResponse} from "./I24hrTickerResponse";

export interface ITicker extends I24hrTickerResponse{
	askQty: string;
	bidQty: string;
}
