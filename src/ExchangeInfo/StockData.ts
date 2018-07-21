import {Candle} from './Candle';

export class StockData {
	reversedInput?: boolean;

	constructor(public open: number[], public high: number[], public low: number[], public close: number[], reversedInput: boolean) {
		this.reversedInput = reversedInput;
	}
}

export class CandleData {
	close?: number;
	high?: number;
	low?: number;
	open?: number;
	timestamp?: number;
	volume?: number;
}

export class CandleList {
	close?: number[] = [];
	high?: number[] = [];
	low?: number[] = [];
	open?: number[] = [];
	timestamp?: number[] = [];
	volume?: number[] = [];

	static toCandleList(candles: Candle[]): CandleList {
		let candleList: number[] = candles.map(x => x.close);
		let cList = new CandleList();
		candles.forEach((item, i) => {
			cList.open.push(candles[i].open);
			cList.high.push(candles[i].high);
			cList.low.push(candles[i].low);
			cList.close.push(candles[i].close);
		});

		return cList;
	}
}

