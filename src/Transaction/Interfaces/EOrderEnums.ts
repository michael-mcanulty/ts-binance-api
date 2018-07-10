export enum EOrderType {
	LIMIT,
	MARKET,
	STOP_LOSS,
	STOP_LOSS_LIMIT,
	TAKE_PROFIT,
	TAKE_PROFIT_LIMIT,
	LIMIT_MAKER
}

export enum EOrderStatus {
	NEW,
	PARTIALLY_FILLED,
	FILLED,
	CANCELED,
	PENDING_CANCEL,
	REJECTED,
	EXPIRED
}

export enum EOrderSide {
	BUY,
	SELL
}

export enum ETimeInForce {
	GTC,
	IOC,
	FOK
}

export enum EExecutionType {
	NEW,
	CANCELED,
	REPLACED,
	REJECTED,
	TRADE,
	EXPIRED
}

export enum ENewOrderRespType {
	ACK,
	RESULT,
	FULL
}