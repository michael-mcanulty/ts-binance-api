import { BotHttp } from "./BotHttp";
import { IListenKey } from "./Interfaces/IListenKey";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { CandleInterval } from "../ExchangeInfo/CandleInterval";
import { Market } from "../Market/Market";
import { ENewOrderRespType, ETimeInForce } from "../Transaction/Interfaces/EOrderEnums";
import { Order } from "../Transaction/Order";
import { OpenOrder } from "../Transaction/OpenOrder";
import { OutboundAccountInfo } from "../Account/OutboundAccountInfo";
import { Balance } from "../Balances/Balance";
import { CancelOrderResponse } from "../Transaction/CancelOrderResponse";
import { TestOrder } from "../Transaction/TestOrder";
import { IExchangeInfo } from "../ExchangeInfo/Interfaces/IExchangeInfo";
import {ITotalBalance, Price} from "..";
import {IDepositAddressResult} from "../Deposit/Interfaces/IDepositAddressResult";
import {IDepositAddressReq} from "../Deposit/Interfaces/IDepositAddressReq";
import {IDepositHistoryResult} from "../Deposit/Interfaces/IDepositHistoryResult";
import {IDepositHistoryReq} from "../Deposit/Interfaces/IDepositHistoryReq";
import {ISystemStatus} from "../Binance/Interfaces/ISystemStatus";
import {IWithdrawlHistoryReq} from "../Withdrawl/Interfaces/IWithdrawlHistoryReq";
import {IWithdrawlHistoryResult} from "../Withdrawl/Interfaces/IWithdrawlHistoryResult";
export declare class Rest extends BotHttp {
    static listenKey: IListenKey;
    private _cancelOrder(cancelOrder);
    private _getCandlesInterval(symbol, interval, limit?);
    static getQuoteAssetName(symbol: string): string;
    private _newOrder(order);
    cancelOrder(symbol: string, orderId: number): Promise<CancelOrderResponse>;
    cancelOrdersBySymbol(symbol: string): Promise<CancelOrderResponse[]>;
    closeDataStream(): Promise<{}>;
    getAccountInfo(recvWindow?: number): Promise<OutboundAccountInfo>;
    getAllOrders(symbol: string, limit?: number, orderId?: number, recvWindow?: number): Promise<Order[]>;

	getAvailableTotalBalance(quoteAsset: string, dollarBaseAsset?: string, primaryBaseAsset?: string): Promise<ITotalBalance>;
    getBalances(recvWindow?: number, gtZeroOnly?: boolean): Promise<Balance[]>;
    getCandles(symbols: string[], intervals: string[], limit?: number): Promise<CandleInterval[]>;
    getDataStream(): Promise<IListenKey>;
    getExchangeInfo(): Promise<IExchangeInfo>;
    getMarkets(quoteAsset?: string): Promise<Market[]>;
    getOpenOrders(symbol: string, orderId?: number, recvWindow?: number, origClientOrderId?: string): Promise<OpenOrder[]>;
    getOrder(symbol: string, orderId: number, recvWindow?: number, origClientOrderId?: string): Promise<Order>;
    getPrices(): Promise<Price[]>;
    keepDataStream(): Promise<{}>;
    limitBuy(symbol: string, quantity: number, price: number, recvWindow?: number, iceburgQty?: number, timeInForce?: ETimeInForce, stopPrice?: number, newClientOrderId?: string, newOrderRespType?: ENewOrderRespType): Promise<Order | TestOrder>;
    limitSell(symbol: string, quantity: number, price: number, recvWindow?: number, iceburgQty?: number, timeInForce?: ETimeInForce, stopPrice?: number, newClientOrderId?: string, newOrderRespType?: ENewOrderRespType): Promise<Order | TestOrder>;
    marketBuy(symbol: string, quantity: number, recvWindow?: number): Promise<Order | TestOrder>;
    marketSell(symbol: string, quantity: number, recvWindow?: number): Promise<Order | TestOrder>;

	getDepositAddress(request: IDepositAddressReq): Promise<IDepositAddressResult>;

	getDepositHisory(request: IDepositHistoryReq): Promise<IDepositHistoryResult>;

	getStatus(): Promise<ISystemStatus>;

	getWithdrawlHisory(request: IWithdrawlHistoryReq): Promise<IWithdrawlHistoryResult>;
    constructor(options: IBinanceOptions);
}
