import {iAccountBalanceBinance} from "./iAccountBalanceBinance";

export interface iAccountBinance {
	balances: iAccountBalanceBinance[];
	buyerCommission: number;
	canDeposit: boolean;
	canTrade: boolean;
	canWithdraw: boolean;
	makerCommission: number;
	sellerCommission: number;
	takerCommission: number;
	updateTime: number;
}