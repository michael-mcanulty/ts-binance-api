import { ICallOpts } from "./Interfaces/ICallOpts";
import { EMethod } from "./EMethod";
import { ApiHeader } from "./ApiHeader";
export declare class CallOptions implements ICallOpts {
    headers: ApiHeader | any;
    json: boolean;
    method: string;
    noData: boolean;
    noExtra: boolean;
    constructor(method: EMethod, json?: boolean, noData?: boolean, noExtra?: boolean, apiKey?: string, headers?: any);
}
