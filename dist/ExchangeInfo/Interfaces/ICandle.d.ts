export interface ICandle {
    closeTime: Date;
    openTime: Date;
    open: number;
    high: number;
    interval?: string;
    low: number;
    close: number;
    symbol?: string;
    volume: number;
}
