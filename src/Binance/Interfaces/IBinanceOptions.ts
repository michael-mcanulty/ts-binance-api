import {IBinanceApiAuth} from "../../Account/Interfaces/IBinanceApiAuth";
import {IServiceOptions} from "../../Error/Email/Interfaces/IServiceOptions";
import {IMessageOptions} from "../../Error/Email/Interfaces/IMessageOptions";

export interface IBinanceOptions {
	_id?: string;
	auth: IBinanceApiAuth;
	emailServiceOpts: IServiceOptions;
	emailMsgOpts: IMessageOptions;
	test: boolean;
	useServerTime: boolean;
}