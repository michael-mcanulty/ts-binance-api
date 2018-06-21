export interface iBinanceBalances {
	[key: string]: {
		available: string;
		locked: string;
	};
}