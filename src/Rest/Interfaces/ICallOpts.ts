import {EMethod} from "../EMethod";

export interface ICallOpts {
	headers: any;
	json: boolean;
	method: EMethod;
	noData?: boolean;
	noExtra?: boolean;
}