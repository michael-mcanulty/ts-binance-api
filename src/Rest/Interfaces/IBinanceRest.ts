import {INewOrder} from "../../Transaction/Interfaces/INewOrder";
import {IExchangeInfo} from "../../ExchangeInfo/Interfaces/IExchangeInfo";
import {Order} from "../../Transaction/Order";
import {Price} from "../../Transaction/Price";
import {IQueryOrderResult} from "../../Transaction/Interfaces/IQueryOrderResult";
import {ICancelOrderResult} from "../../Transaction/Interfaces/iCandleOrderResult";
import {iCandlesOptions} from "../../ExchangeInfo/Interfaces/ICandleOptions";
import {CandleInterval} from "../../ExchangeInfo/CandleInterval";

export interface IBinanceRest {
    accountInfo(options?: { useServerTime: boolean }): Promise<Account>;

	cancelOrder(options: { symbol: string; orderId: number, useServerTime?: boolean }): Promise<ICancelOrderResult>;

    candles(options: iCandlesOptions): Promise<CandleInterval[]>;

	exchangeInfo(): Promise<IExchangeInfo>;

	getOrder(options: { symbol: string; orderId: number, useServerTime?: boolean }): Promise<IQueryOrderResult>;

	openOrders(options: { symbol: string, useServerTime?: boolean }): Promise<IQueryOrderResult[]>;

	order(options: INewOrder): Promise<Order>;

	orderTest(options: INewOrder): Promise<Order>;

    prices(): Promise<Price[]>;

    time(): Promise<number>;
}