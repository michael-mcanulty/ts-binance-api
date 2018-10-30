export interface ICandle{
	close: number;
	date: Date;
	high: number;
	interval?: string;
	low: number;
	open: number;
	symbol?: string;
	volume: number;
}