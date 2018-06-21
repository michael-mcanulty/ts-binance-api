export interface iStreamTickerRaw {
	A: string;
	B: string;
	C: number;
	E: number;
	F: number;
	L: number;
	O: number;
	P: string;
	Q: string;
	a: string;
	b: string;
	c: string;
	e: string;
	h: string;
	l: string;
	n: number;
	o: string;
	p: string;
	q: string;
	s: string;
	v: string;
	w: string;
	x: string;
}

export interface iStreamTicker {
	bestAsk: string;
	bestAskQnt: string;
	bestBid: string;
	bestBidQnt: string;
	closeTime: number;
	closeTradeQuantity: string;
	curDayClose: string;
	eventTime: number;
	eventType: string;
	firstTradeId: number;
	high: string;
	lastTradeId: number;
	low: string;
	open: string;
	openTime: number;
	prevDayClose: string;
	priceChange: string;
	priceChangePercent: string;
	symbol: string;
	totalTrades: number;
	volume: string;
	volumeQuote: string;
	weightedAvg: string;
}