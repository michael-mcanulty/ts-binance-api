export interface ICandle {
    closeTime: Date;
    openTime: Date;
    high: number;
    interval?: string;
    low: number;
    open: number;
    symbol?: string;
    volume: number;
}
