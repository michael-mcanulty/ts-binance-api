export enum eOrderType {
	LIMIT,
	MARKET,
	STOP_LOSS,
	STOP_LOSS_LIMIT,
	TAKE_PROFIT,
	TAKE_PROFIT_LIMIT,
	LIMIT_MAKER
}

export enum eOrderStatus {
	NEW,
	PARTIALLY_FILLED,
	FILLED,
	CANCELED,
	PENDING_CANCEL,
	REJECTED,
	EXPIRED
}

export enum eOrderSide {
	BUY,
	SELL
}

export enum eTimeInForce {
	GTC,
	IOC,
	FOK
}
export enum eExecutionType {
	NEW,
	CANCELED,
	REPLACED,
	REJECTED,
	TRADE,
	EXPIRED
}