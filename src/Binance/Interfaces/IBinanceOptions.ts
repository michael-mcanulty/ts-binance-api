import {IBinanceApiAuth} from "../../Account/Interfaces/IBinanceApiAuth";

export interface IBinanceOptions {
	auth: IBinanceApiAuth;
	test: boolean;
	useServerTime: boolean;
}