import { BaseQueryOrder } from "./BaseQueryOrder";
import { IAllOrders } from "./Interfaces/IAllOrders";
import { IGetAllOrdersOpts } from "./Interfaces/IGetAllOrdersOpts";
export declare class AllOrders extends BaseQueryOrder implements IAllOrders {
    limit: number;
    toObjLiteral(): IAllOrders;
    constructor(config: IGetAllOrdersOpts);
}
