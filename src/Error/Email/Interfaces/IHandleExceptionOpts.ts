import {EMethod} from "../../../Rest/EMethod";

export interface IHandleExceptionOpts {
	endpoint?: string[]|string;
	method?: EMethod;
	payload?: any;
	workerId?: number;
}