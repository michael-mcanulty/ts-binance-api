import {EMethod} from "../../../Rest/EMethod";

export interface IHandleExceptionOptions {
	endpoint?: string[]|string;
	method?: EMethod;
	payload?: any;
	killWorker?: number;
	code: number;
	message: string;
}