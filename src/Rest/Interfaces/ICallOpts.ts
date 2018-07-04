import {EMethod} from "../EMethod";

export interface ICallOpts {
 headers: Headers;
 json:boolean;
	method: EMethod;
 noData?: boolean;
 noExtra?: boolean;
}