import { IBaseQueryOrder } from "../Transaction/Interfaces/IBaseQueryOrder";
import { Signed } from "../Rest/Signed";
export declare class BaseQueryOrder extends Signed {
    orderId: number;
    recvWindow: number;
    symbol: string;
    constructor(baseQuery: IBaseQueryOrder);
}
