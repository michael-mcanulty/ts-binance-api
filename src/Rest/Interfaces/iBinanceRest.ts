import {iNewOrder} from "../../Transaction/Interfaces/iNewOrder";
import {iExchangeInfo} from "../../ExchangeInfo/Interfaces/iExchangeInfo";
import {Order} from "../../Transaction/Order";
import {Price} from "../../Transaction/Price";
import {iQueryOrderResult} from "../../Transaction/Interfaces/iQueryOrderResult";
import {iCancelOrderResult} from "../../Transaction/Interfaces/iCandleOrderResult";
import {iCandlesOptions} from "../../ExchangeInfo/Interfaces/iCandleOptions";
import {CandleInterval} from "../../ExchangeInfo/CandleInterval";

export interface iBinanceRest {
    accountInfo(options?: { useServerTime: boolean }): Promise<Account>;

    cancelOrder(options: { symbol: string; orderId: number, useServerTime?: boolean }): Promise<iCancelOrderResult>;

    candles(options: iCandlesOptions): Promise<CandleInterval[]>;

    exchangeInfo(): Promise<iExchangeInfo>;

    getOrder(options: { symbol: string; orderId: number, useServerTime?: boolean }): Promise<iQueryOrderResult>;

    openOrders(options: { symbol: string, useServerTime?: boolean }): Promise<iQueryOrderResult[]>;

    order(options: iNewOrder): Promise<Order>;

    orderTest(options: iNewOrder): Promise<Order>;

    prices(): Promise<Price[]>;

    time(): Promise<number>;
}