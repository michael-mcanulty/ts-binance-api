export interface ICandle{
	closeTime: Date;
	openTime: Date;
	high: number;
	interval?: string;
	low: number;
	symbol?: string;
	volume: number;
}