import { IOutboundAccountInfoStream } from "./Interfaces/IOutboundAccountInfoStream";
import { Balance } from "../Balances/Balance";
import { IOutboundAccountInfoRest } from "./Interfaces/IOutboundAccountInfoRest";
export declare class OutboundAccountInfo {
    balances: Balance[];
    buyerCommissionRate: number;
    canDeposit: boolean;
    canTrade: boolean;
    canWithdraw: boolean;
    eventTime: number;
    eventType: string;
    lastAccountUpdate: number;
    makerCommissionRate: number;
    sellerCommissionRate: number;
    takerCommissionRate: number;
    static fromBinanceRest(account: IOutboundAccountInfoRest): OutboundAccountInfo;
    static fromBinanceStream(iOutInfoRaw: IOutboundAccountInfoStream): OutboundAccountInfo;
    constructor(balances: Balance[], buyerCommissionRate: number, canDeposit: boolean, canTrade: boolean, canWithdraw: boolean, eventTime: number, lastAccountUpdate: number, makerCommissionRate: number, sellerCommissionRate: number, takerCommissionRate: number);
}
