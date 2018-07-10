import {EMethod} from "../EMethod";

export interface ICallOpts {
	headers: Headers | any;
 json:boolean;
	method: EMethod;
 noData?: boolean;
 noExtra?: boolean;
}