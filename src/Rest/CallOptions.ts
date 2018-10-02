import {ICallOpts} from "./Interfaces/ICallOpts";
import {ApiHeader} from "./ApiHeader";
import {TMethod} from "./TMethod";

export class CallOptions{
	headers?: ApiHeader | any;
	json?: boolean;
	method: string;
	noData?: boolean;
	noExtra?: boolean;

	public toDBFormat(): ICallOpts{
			let dbFormat: ICallOpts = <ICallOpts>{};
			dbFormat.method = <TMethod>this.method;
			dbFormat.noExtra = this.noExtra;
			dbFormat.json = this.json;
			dbFormat.headers = this.headers;
			return dbFormat;
	}

	constructor(options: ICallOpts, apiKey?: string) {
		this.method = <string> options.method;
		this.json = options.json || true;
		this.noData = options.noData || false;
		this.noExtra = options.noExtra || false;
		if (apiKey || options.headers) {
			this.headers = options.headers || new ApiHeader(apiKey);
		}
	}
}