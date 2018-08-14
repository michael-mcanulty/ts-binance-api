import { BaseQueryOrder } from "./BaseQueryOrder";
import { IAllOrders } from "./Interfaces/IAllOrders";
export declare class AllOrders extends BaseQueryOrder implements IAllOrders {
    limit: number;
    constructor(symbol: string, orderId: number, limit: number, recvWindow?: number);
}
