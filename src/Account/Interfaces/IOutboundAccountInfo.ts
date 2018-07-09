import {IBinanceBalances} from "../../Balances/IBinanceBalances";
import {IMessage} from "./IMessage";

export interface IOutboundAccountInfo extends IMessage {
	balances: IBinanceBalances;
	buyerCommissionRate: number;
	canDeposit: boolean;
	canTrade: boolean;
	canWithdraw: boolean;
	lastAccountUpdate: number;
	makerCommissionRate: number;
	sellerCommissionRate: number;
	takerCommissionRate: number;
}