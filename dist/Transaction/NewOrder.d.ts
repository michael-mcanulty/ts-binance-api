import { ENewOrderRespType, EOrderSide, EOrderType, ETimeInForce } from "./Interfaces/EOrderEnums";
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
    constructor(symbol: string, quantity: number, side: EOrderSide, type: EOrderType, price?: number, icebergQty?: number, timeInForce?: ETimeInForce, stopPrice?: number, recvWindow?: number, newClientOrderId?: string, newOrderRespType?: ENewOrderRespType);
}
