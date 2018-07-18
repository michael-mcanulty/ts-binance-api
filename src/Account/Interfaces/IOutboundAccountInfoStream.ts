export interface IBalanceStream {
	a: string;
	f: string;
	l: string;
}

export interface IOutboundAccountInfoStream {
	B: IBalanceStream[];
	D: boolean;
	E: number;
	T: boolean;
	W: boolean;
	b: number;
	e: string;
	m: number;
	s: number;
	t: number;
	u: number;
}