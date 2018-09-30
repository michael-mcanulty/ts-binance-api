import { ENewOrderRespType, ETimeInForce } from "./EOrderEnums";
export interface ILimitOrderOpts {
    symbol: string;
    quantity: number;
    price: number;
    recvWindow?: number;
    iceburgQty?: number;
    timeInForce?: ETimeInForce;
    stopPrice?: number;
    newClientOrderId?: string;
    newOrderRespType?: ENewOrderRespType;
}
