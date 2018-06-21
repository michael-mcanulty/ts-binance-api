import {eMethod} from "../eMethod";

export interface iCallOpts{
 headers: Headers;
 json:boolean;
 method: eMethod;
 noData?: boolean;
 noExtra?: boolean;
}