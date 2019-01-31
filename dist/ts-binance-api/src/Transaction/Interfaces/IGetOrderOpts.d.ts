export interface IGetOrderOpts {
    symbol: string;
    orderId: number;
    recvWindow?: number;
    origClientOrderId?: string;
}
