import {IBinanceApiAuth} from "../../Account/Interfaces/IBinanceApiAuth";
import {IMessageOptions} from "../../Error/Interfaces/IMessageOptions";
import {ISmtpOptions} from "../../Error/Interfaces/ISmtpOptions";

export interface IBinanceOptions {
	_id?: string;
	auth: IBinanceApiAuth;
	emailServiceOpts: ISmtpOptions;
	emailMsgOpts: IMessageOptions;
	test: boolean;
	useServerTime: boolean;
}