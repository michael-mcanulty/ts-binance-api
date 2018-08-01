import { Signed } from "../Rest/Signed";
export declare class BaseOrder extends Signed {
    price: number;
    side: string;
    symbol: string;
    timeInForce: string;
    type: string;
    constructor(price: number, side: string, symbol: string, type: string, timeInForce: string);
}
