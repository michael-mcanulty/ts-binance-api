import { TNewOrderRespType, TTimeInForce } from "./EOrderEnums";
export interface ILimitOrderOpts {
    symbol: string;
    quantity: number;
    price: number;
    recvWindow?: number;
    iceburgQty?: number;
    timeInForce?: TTimeInForce;
    stopPrice?: number;
    newClientOrderId?: string;
    newOrderRespType?: TNewOrderRespType;
}
