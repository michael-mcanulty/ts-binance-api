import {EErrorType} from "./Email/Enums/EErrorType";
import {BinanceError} from "./BinanceError";
import {HttpErrorHandler} from "./HttpErrorHandler";
import allErrors from "./allErrors";

export class HttpError extends Error {
	public static all: HttpError[] = <HttpError[]>allErrors;
  code: number;
	message: string;
	handler?: HttpErrorHandler;

	public static GetErrorType(err: BinanceError | HttpError): EErrorType {
		let code: number = parseInt(err.code.toString());
		let isBinance: boolean = false;
		if (typeof err['msg'] === "string" && code < 0) {
			isBinance = true;
		} else if (typeof err['message'] === "string") {
			isBinance = false;
		}
		return (isBinance) ? EErrorType.Binance : EErrorType.Node;
	}

	public static GetErrorByCode(code: number): HttpError {
		let result: HttpError;
		if (HttpError.all.length > 0) {
			let filtered: HttpError[] = HttpError.all.filter(handler => handler.code === code);
			if (filtered && filtered.length > 0) {
				result = filtered[0];
			}
		}
		return result;
	}

	public static GetTimeoutFromIPBannedMsg(err: BinanceError): number {
		let strFloat: string;
		let result: number = 0;
		if (err && err.msg) {
			let msg: string = "IP banned until ";
			let startIdx = err.msg.indexOf(msg) + msg.length;
			let float = parseFloat(err.msg.slice(startIdx, startIdx + 13));
			strFloat = float.toString();
			if (strFloat.length === 13) {
				result = float - new Date().getTime();
			}
		}
		return result;
	}

	constructor(err: BinanceError | HttpError) {
		super();
		this.code = parseInt(err.code.toString());
		let type: EErrorType = HttpError.GetErrorType(err);
		this.message = (type === EErrorType.Binance) ? err['msg'] : err['message'];
		let error:HttpError = HttpError.GetErrorByCode(this.code);
		if(error){
			this.handler = error.handler;
			if(error.handler && (!error.handler.code || !error.handler.message)) {
				error.handler.code = this.code;
				error.handler.message = this.message;
				error.handler.handleError(error);
			}
		}
	}
}
