import { IBaseOrder } from "./IBaseOrder";
import { IFill } from "./IFill";
export interface IOrder extends IBaseOrder {
    clientOrderId: string;
    executedQty: string;
    isWorking?: boolean;
    orderId: number;
    origQty: string;
    status: string;
    transactTime: number;
    fills: IFill[];
}
