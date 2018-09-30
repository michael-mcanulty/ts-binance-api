export interface IMarketOrderOpts {
    symbol: string;
    quantity: number;
    recvWindow?: number;
    iceburgQty?: number;
    newClientOrderId: string;
    newOrderRespType: string;
}
