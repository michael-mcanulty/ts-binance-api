import {IBinanceApiAuth} from "../../Account/Interfaces/IBinanceApiAuth";
import {IServiceOptions} from "../../Error/Email/Interfaces/IServiceOptions";

export interface IBinanceOptions {
	_id?: string;
	auth: IBinanceApiAuth;
	emailServiceOpts: IServiceOptions;
	errorMsgRecipient: string;
	test: boolean;
	useServerTime: boolean;
}