import { IBinanceOptions } from "./Binance/Interfaces/IBinanceOptions";
import { Binance } from "./Binance/Binance";
export declare class Bot {
    static binance: Binance;
    constructor(opts: IBinanceOptions);
}
