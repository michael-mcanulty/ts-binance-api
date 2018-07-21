import { IFill } from "./IFill";
import { IBaseOrder } from "./IBaseOrder";
export interface IOrder extends IBaseOrder {
    clientOrderId: string;
    executedQty: string;
    fills?: IFill[];
    isWorking?: boolean;
    orderId: number;
    origQty: string;
    status: string;
    transactTime: number;
}
