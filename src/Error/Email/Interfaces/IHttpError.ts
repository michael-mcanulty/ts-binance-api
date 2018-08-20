import {HttpErrorHandler} from "../../../../src/Error/HttpError";

export class IHttpError{
	code: number;
	message: string;
	handler?: HttpErrorHandler;
}