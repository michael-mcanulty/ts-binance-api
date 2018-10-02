import {TMethod} from "../TMethod";

export interface ICallOpts {
	headers?: any;
	json?: boolean;
	method: TMethod;
	noData?: boolean;
	noExtra?: boolean;
}