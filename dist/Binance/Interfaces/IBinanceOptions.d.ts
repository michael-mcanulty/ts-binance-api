import { BinanceApiAuth } from "../../Account/BinanceApiAuth";
export interface IBinanceOptions {
    auth: BinanceApiAuth;
    test: boolean;
    useServerTime: boolean;
}
