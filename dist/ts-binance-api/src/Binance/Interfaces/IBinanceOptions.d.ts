import { IBinanceApiAuth } from "../../Account/Interfaces/IBinanceApiAuth";
export interface IBinanceOptions {
    _id?: string;
    auth: IBinanceApiAuth;
    test: boolean;
    useServerTime: boolean;
}
