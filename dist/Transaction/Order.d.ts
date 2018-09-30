import { IOrder } from "./Interfaces/IOrder";
import { BaseOrder } from "./BaseOrder";
import { Fill } from "./Fill";
export declare class Order extends BaseOrder {
    clientOrderId: string;
    executedQty: number;
    orderId: number;
    origQty: number;
    status: string;
    transactTime: number;
    price: number;
    side: string;
    symbol: string;
    timeInForce: string;
    type: string;
    fills?: Fill[];
    static toBinance(order: Order): IOrder;
    constructor(order: IOrder);
}
