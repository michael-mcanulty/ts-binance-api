import {ISMTPOptions} from "./ISMTPOptions";
import {IMessageOptions} from "./IMessageOptions";
import {EMethod} from "../../../Rest/EMethod";

export interface IHttpErrorHandler {
	type: string;
	sendEmail: boolean;
	emailMsgOpts?: IMessageOptions;
	emailServiceOpts?: ISMTPOptions;
	endpoint?: string[]|string;
	method?: EMethod;
	payload?: any;
}