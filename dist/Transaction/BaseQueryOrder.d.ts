import { Signed } from "../Rest/Signed";
export declare class BaseQueryOrder extends Signed {
    orderId: number;
    recvWindow: number;
    symbol: string;
    constructor(symbol: string, orderId: number, recvWindow?: number);
}
