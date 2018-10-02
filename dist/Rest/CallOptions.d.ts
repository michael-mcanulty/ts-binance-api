import { ICallOpts } from "./Interfaces/ICallOpts";
import { ApiHeader } from "./ApiHeader";
export declare class CallOptions {
    headers?: ApiHeader | any;
    json?: boolean;
    method: string;
    noData?: boolean;
    noExtra?: boolean;
    toDBFormat(): ICallOpts;
    constructor(options: ICallOpts, apiKey?: string);
}
