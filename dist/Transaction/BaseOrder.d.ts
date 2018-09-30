import { Signed } from "../Rest/Signed";
import { IBaseOrder } from "./Interfaces/IBaseOrder";
export declare class BaseOrder extends Signed {
    price?: number;
    side: string;
    symbol: string;
    timeInForce?: string;
    type: string;
    constructor(base: IBaseOrder);
}
