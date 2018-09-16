import {EMethod} from "../../../Rest/EMethod";
import {IBaseHandleException} from "./IBaseHandleException";

export interface IHandleExceptionOptions extends IBaseHandleException {
	code: number;
	message: string;
	originAddress: string;
}
