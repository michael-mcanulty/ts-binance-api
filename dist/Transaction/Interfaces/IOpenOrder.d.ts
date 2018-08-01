import { IBaseOrder } from "./IBaseOrder";
export interface IOpenOrder extends IBaseOrder {
    clientOrderId: string;
    executedQty: string;
    icebergQty: string;
    isWorking: boolean;
    orderId: number;
    origQty: string;
    status: string;
    stopPrice: string;
    time: number;
}
