import { Signed } from "../Rest/Signed";
import { IBaseOrder } from "./Interfaces/IBaseOrder";
export declare class BaseOrder extends Signed {
    price?: string;
    side: string;
    symbol: string;
    timeInForce?: string;
    type: string;
    constructor(base: IBaseOrder);
}
