import { ICancelOrderResponse } from "./Interfaces/ICancelOrderResponse";
export declare class CancelOrderResponse implements ICancelOrderResponse {
    clientOrderId: string;
    orderId: number;
    origClientOrderId: string;
    symbol: string;
    constructor(result: ICancelOrderResponse);
}
