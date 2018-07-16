import {ICallOpts} from "./Interfaces/ICallOpts";
import {EMethod} from "./EMethod";
import {ApiHeader} from "./ApiHeader";

export class CallOptions implements ICallOpts {
	headers: ApiHeader | any;
	json: boolean;
	method: string;
	noData: boolean;
	noExtra: boolean;

	constructor(method: EMethod, json?: boolean, noData?: boolean, noExtra?: boolean, apiKey?: string, headers?: any) {
		this.method = EMethod[method];
		this.json = json || true;
		this.noData = noData || false;
		this.noExtra = noExtra || false;
		if (apiKey || headers) {
			this.headers = headers || new ApiHeader(apiKey);
		}
	}
}