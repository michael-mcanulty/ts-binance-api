import {ILimits} from "../../ExchangeInfo/Interfaces/ILimits";

export interface IMarket {
	_id: string
	baseAsset: string;
	date: Date;
	limits: ILimits;
	quoteAsset: string;
	symbol: string;
}