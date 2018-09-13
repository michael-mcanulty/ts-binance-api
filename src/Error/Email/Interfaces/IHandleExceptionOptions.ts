import {EMethod} from "../../../Rest/EMethod";

export interface IHandleExceptionOptions {
	endpoint?: string[]|string;
	method?: EMethod;
	payload?: any;
	killWorker?: boolean;
	workerId?: number;
	code: number;
	message: string;
	originAddress: string;
}