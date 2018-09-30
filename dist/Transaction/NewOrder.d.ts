import { BaseOrder } from "./BaseOrder";
import { INewOrder } from "./Interfaces/INewOrder";
export declare class NewOrder extends BaseOrder {
    icebergQty?: number;
    newClientOrderId?: string;
    newOrderRespType?: string;
    quantity: number;
    recvWindow?: number;
    stopPrice?: number;
    static toBinance(newOrder: NewOrder): INewOrder;
    constructor(newOrder: INewOrder);
}
