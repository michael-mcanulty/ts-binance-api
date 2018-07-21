import { Candle } from './Candle';
export declare class StockData {
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    reversedInput?: boolean;
    constructor(open: number[], high: number[], low: number[], close: number[], reversedInput: boolean);
}
export declare class CandleData {
    close?: number;
    high?: number;
    low?: number;
    open?: number;
    timestamp?: number;
    volume?: number;
}
export declare class CandleList {
    close?: number[];
    high?: number[];
    low?: number[];
    open?: number[];
    timestamp?: number[];
    volume?: number[];
    static toCandleList(candles: Candle[]): CandleList;
}
