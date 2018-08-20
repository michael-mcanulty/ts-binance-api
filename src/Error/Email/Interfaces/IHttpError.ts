import {HttpErrorHandler} from "../../../../src/Error/HttpErrorHandler";

export class IHttpError{
	code: number;
	message: string;
	handler?: HttpErrorHandler;
}