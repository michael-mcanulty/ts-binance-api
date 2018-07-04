import {IAccountBalanceBinance} from "./IAccountBalanceBinance";

export interface IAccountBinance {
	balances: IAccountBalanceBinance[];
	buyerCommission: number;
	canDeposit: boolean;
	canTrade: boolean;
	canWithdraw: boolean;
	makerCommission: number;
	sellerCommission: number;
	takerCommission: number;
	updateTime: number;
}