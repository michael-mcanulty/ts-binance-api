import { BotHttp } from "./BotHttp";
import { IListenKey } from "./Interfaces/IListenKey";
import { IBinanceOptions } from "../Binance/Interfaces/IBinanceOptions";
import { CandleInterval } from "../ExchangeInfo/CandleInterval";
import { Market } from "../Market/Market";
import { Order } from "../Transaction/Order";
import { OpenOrder } from "../Transaction/OpenOrder";
import { OutboundAccountInfo } from "../Account/OutboundAccountInfo";
import { Balance } from "../Balances/Balance";
import { CancelOrderResponse } from "../Transaction/CancelOrderResponse";
import { TestOrder } from "../Transaction/TestOrder";
import { IExchangeInfo } from "../ExchangeInfo/Interfaces/IExchangeInfo";
import { IDepositAddressResult } from "../Deposit/Interfaces/IDepositAddressResult";
import { IDepositAddressReq } from "../Deposit/Interfaces/IDepositAddressReq";
import { IDepositHistoryResult } from "../Deposit/Interfaces/IDepositHistoryResult";
import { IDepositHistoryReq } from "../Deposit/Interfaces/IDepositHistoryReq";
import { ISystemStatus } from "../Binance/Interfaces/ISystemStatus";
import { IWithdrawHistoryReq } from "../Withdraw/Interfaces/IWithdrawHistoryReq";
import { IWithdrawHistoryResult } from "../Withdraw/Interfaces/IWithdrawHistoryResult";
import { ILimitOrderOpts } from "../Transaction/Interfaces/ILimitOrderOpts";
import { IGetOrderOpts } from "../Transaction/Interfaces/IGetOrderOpts";
import { IMarketOrderOpts } from "../Transaction/Interfaces/IMarketOrderOpts";
import { IGetAllOrdersOpts } from "../Transaction/Interfaces/IGetAllOrdersOpts";
import { ICancelOrderOpts } from "../Transaction/Interfaces/ICancelOrderOpts";
import { ITotalBalance } from "../Balances/Interfaces/ITotalBalance";
import { Price } from "../Transaction/Price";
import { IGetTotalBalanceOpts } from "../Balances/Interfaces/IGetTotalBalanceOpts";
import { I24hrTickerResponse } from "../ExchangeInfo/Interfaces/I24hrTickerResponse";
export declare class Rest extends BotHttp {
    static listenKey: IListenKey;
    private _cancelOrder;
    private _getCandlesInterval;
    private _newOrder;
    cancelOrder(options: ICancelOrderOpts): Promise<CancelOrderResponse>;
    cancelOrdersBySymbol(options: ICancelOrderOpts): Promise<CancelOrderResponse[]>;
    closeDataStream(): Promise<object>;
    getAccountInfo(recvWindow?: number): Promise<OutboundAccountInfo>;
    getAllCandles(symbols: string[], intervals: string[], limit?: number): Promise<CandleInterval[]>;
    getAllOrders(options: IGetAllOrdersOpts): Promise<Order[]>;
    getAvailableTotalBalance(opts?: IGetTotalBalanceOpts): Promise<ITotalBalance[]>;
    getBalances(recvWindow?: number, gtZeroOnly?: boolean): Promise<Balance[]>;
    getCandlesBySymbol(symbol: string, intervals: string[], limit?: number): Promise<CandleInterval[]>;
    getDataStream(): Promise<IListenKey>;
    getDepositAddress(request: IDepositAddressReq): Promise<IDepositAddressResult>;
    getDepositHisory(request: IDepositHistoryReq): Promise<IDepositHistoryResult>;
    getExchangeInfo(): Promise<IExchangeInfo>;
    getMarkets(quoteAsset?: string): Promise<Market[]>;
    getOpenOrders(options: IGetOrderOpts): Promise<OpenOrder[]>;
    getOrder(options: IGetOrderOpts): Promise<Order>;
    get24hrTicker(symbol?: string): Promise<I24hrTickerResponse[]>;
    getPrices(): Promise<Price[]>;
    getStatus(): Promise<ISystemStatus>;
    getWithdrawHisory(request: IWithdrawHistoryReq): Promise<IWithdrawHistoryResult>;
    keepDataStream(): Promise<{}>;
    limitBuy(options: ILimitOrderOpts): Promise<Order | TestOrder>;
    limitSell(options: ILimitOrderOpts): Promise<Order | TestOrder>;
    marketBuy(options: IMarketOrderOpts): Promise<Order | TestOrder>;
    marketSell(options: IMarketOrderOpts): Promise<Order | TestOrder>;
    constructor(options: IBinanceOptions);
}