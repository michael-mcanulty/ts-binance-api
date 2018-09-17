import { IHttpError } from "./IHttpError";
import { IEmailOptions } from "./IEmailOptions";
export interface IAllHttpErrors {
    emailOptions: IEmailOptions;
    allErrors: IHttpError[];
}
