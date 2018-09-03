import {HttpErrorHandler} from "../../../../dist/Error/HttpErrorHandler";

export class IHttpError{
	code: number;
	message: string;
	handler?: HttpErrorHandler;
}