import {ILimits} from "../../ExchangeInfo/Interfaces/ILimits";

export interface IMarket {
	baseAsset: string;
	limits: ILimits;
	quoteAsset: string;
	symbol: string;
}