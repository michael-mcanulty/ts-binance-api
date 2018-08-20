import { BaseOrder } from "./BaseOrder";
import { IOrder } from "./Interfaces/IOrder";
export declare class Order extends BaseOrder {
    clientOrderId: string;
    executedQty: number;
    orderId: number;
    origQty: number;
    status: string;
    transactTime: number;
    static toBinance(order: Order): IOrder;
    constructor(symbol: string, price: string, side: string, executedQty: string, orderId: number, origQty: string, status: string, timeInForce: string, type: string, clientOrderId: string, transactTime: number);
}
