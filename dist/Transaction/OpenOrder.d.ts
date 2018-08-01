import { BaseOrder } from "./BaseOrder";
import { IOpenOrder } from "./Interfaces/IOpenOrder";
export declare class OpenOrder extends BaseOrder {
    clientOrderId: string;
    executedQty: number;
    icebergQty: number;
    isWorking: boolean;
    status: string;
    orderId: number;
    origQty: number;
    stopPrice: number;
    time: number;
    static toBinance(openOrder: OpenOrder): IOpenOrder;
    constructor(clientOrderId: string, executedQty: string, orderId: number, origQty: string, price: string, side: string, status: string, symbol: string, type: string, timeInForce: string, icebergQty: string, isWorking: boolean, stopPrice: string, time: number);
}
