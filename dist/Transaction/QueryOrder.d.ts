import { IQueryOrder } from "./Interfaces/IQueryOrder";
import { BaseQueryOrder } from "./BaseQueryOrder";
export declare class QueryOrder extends BaseQueryOrder implements IQueryOrder {
    origClientOrderId: string;
    constructor(symbol: string, orderId: number, recvWindow?: number, origClientOrderId?: string);
}
