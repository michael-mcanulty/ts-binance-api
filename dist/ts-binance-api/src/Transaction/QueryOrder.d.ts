import { IQueryOrder } from "./Interfaces/IQueryOrder";
import { BaseQueryOrder } from "./BaseQueryOrder";
import { IQueryOrderOpts } from "./Interfaces/IQueryOrderOpts";
export declare class QueryOrder extends BaseQueryOrder implements IQueryOrder {
    origClientOrderId: string;
    toObjLiteral(): IQueryOrder;
    constructor(opts: IQueryOrderOpts);
}
