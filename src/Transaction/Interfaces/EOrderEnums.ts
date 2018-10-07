export type TOrderType =
	'LIMIT'|
	'MARKET'|
	'STOP_LOSS'|
	'STOP_LOSS_LIMIT'|
	'TAKE_PROFIT'|
	'TAKE_PROFIT_LIMIT'|
	'LIMIT_MAKER'

export enum EOrderType {
	LIMIT,
	MARKET,
	STOP_LOSS,
	STOP_LOSS_LIMIT,
	TAKE_PROFIT,
	TAKE_PROFIT_LIMIT,
	LIMIT_MAKER
}

export type TOrderStatus =
	'NEW'|
	'PARTIALLY_FILLED'|
	'FILLED'|
	'CANCELED'|
	'PENDING_CANCEL'|
	'REJECTED'|
	'EXPIRED'

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

export type TOrderSide =
	'BUY'|
	'SELL'


export enum ETimeInForce {
	GTC,
	IOC,
	FOK
}

export type TTimeInForce =
	'GTC'|
	'IOC'|
	'FOK'

export enum EExecutionType {
	NEW,
	CANCELED,
	REPLACED,
	REJECTED,
	TRADE,
	EXPIRED
}

export type TExecutionType =
	'NEW'|
	'CANCELED'|
	'REPLACED'|
	'REJECTED'|
	'TRADE'|
	'EXPIRED'


export enum ENewOrderRespType {
	ACK,
	RESULT,
	FULL
}

export type TNewOrderRespType =
	'ACK'|
	'RESULT'|
	'FULL'
