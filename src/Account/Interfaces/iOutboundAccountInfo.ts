import {iBinanceBalances} from "../../ExchangeInfo/Interfaces/iBinanceBalances";
import {iMessage} from "./iMessage";

export interface iOutboundAccountInfo extends iMessage {
	balances: iBinanceBalances;
	buyerCommissionRate: number;
	canDeposit: boolean;
	canTrade: boolean;
	canWithdraw: boolean;
	lastAccountUpdate: number;
	makerCommissionRate: number;
	sellerCommissionRate: number;
	takerCommissionRate: number;
}