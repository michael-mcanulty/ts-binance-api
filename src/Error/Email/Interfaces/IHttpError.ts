import {HttpErrorHandler} from "../../HttpErrorHandler";

export class IHttpError{
	code: number;
	message: string;
	handler?: HttpErrorHandler;
}