export interface ICandleRequest {
	endTime?: number;
	interval: string;
	limit?: number;
	startTime?: number;
	symbol: string;
}