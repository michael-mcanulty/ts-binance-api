import { BaseOrder } from "./BaseOrder";
import { IOpenOrder } from "./Interfaces/IOpenOrder";
export declare class OpenOrder extends BaseOrder {
    clientOrderId: string;
    executedQty: number;
    icebergQty: number;
    isWorking: boolean;
    orderId: number;
    origQty: number;
    status: string;
    stopPrice: number;
    time: number;
    static toBinance(openOrder: OpenOrder): IOpenOrder;
    constructor(openOrder: IOpenOrder);
}
