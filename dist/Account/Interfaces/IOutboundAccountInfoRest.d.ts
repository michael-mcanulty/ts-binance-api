import { IMessage } from "./IMessage";
import { IBalanceRest } from "../../Balances/Interfaces/IBalanceRest";
export interface IOutboundAccountInfoRest extends IMessage {
    balances: IBalanceRest[];
    buyerCommissionRate: number;
    canDeposit: boolean;
    canTrade: boolean;
    canWithdraw: boolean;
    lastAccountUpdate: number;
    makerCommissionRate: number;
    sellerCommissionRate: number;
    takerCommissionRate: number;
}
