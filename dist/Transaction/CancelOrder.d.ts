import { IQueryCancelOrder } from "./Interfaces/IQueryCancelOrder";
import { QueryOrder } from "./QueryOrder";
import { ICancelOrderOpts } from "./Interfaces/ICancelOrderOpts";
export declare class CancelOrder extends QueryOrder implements IQueryCancelOrder {
    newClientOrderId?: string;
    constructor(opts: ICancelOrderOpts);
}
