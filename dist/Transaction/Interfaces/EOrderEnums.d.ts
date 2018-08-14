export declare enum EOrderType {
    LIMIT = 0,
    MARKET = 1,
    STOP_LOSS = 2,
    STOP_LOSS_LIMIT = 3,
    TAKE_PROFIT = 4,
    TAKE_PROFIT_LIMIT = 5,
    LIMIT_MAKER = 6,
}
export declare enum EOrderStatus {
    NEW = 0,
    PARTIALLY_FILLED = 1,
    FILLED = 2,
    CANCELED = 3,
    PENDING_CANCEL = 4,
    REJECTED = 5,
    EXPIRED = 6,
}
export declare enum EOrderSide {
    BUY = 0,
    SELL = 1,
}
export declare enum ETimeInForce {
    GTC = 0,
    IOC = 1,
    FOK = 2,
}
export declare enum EExecutionType {
    NEW = 0,
    CANCELED = 1,
    REPLACED = 2,
    REJECTED = 3,
    TRADE = 4,
    EXPIRED = 5,
}
export declare enum ENewOrderRespType {
    ACK = 0,
    RESULT = 1,
    FULL = 2,
}
