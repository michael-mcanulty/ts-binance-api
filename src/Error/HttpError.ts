import {EErrorType} from "./Email/Enums/EErrorType";
import {BinanceError} from "./BinanceError";
import {HttpErrorHandler} from "./HttpErrorHandler";
import {EMethod} from "../Rest/EMethod";

export class HttpError extends Error {
	public static allErrors: HttpError[] = [
		new HttpError(-1000, "UNKNOWN",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1001, "DISCONNECTED",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true,
				killWorkerOnError: true
			})),

		new HttpError(-1002, "UNAUTHORIZED",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1003, "TOO_MANY_REQUESTS",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1006, "UNEXPECTED_RESP",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1007, "TIMEOUT",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1013, "INVALID_MESSAGE",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1014, "UNKNOWN_ORDER_COMPOSITION",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			 })),

		new HttpError(-1015, "TOO_MANY_ORDERS",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true,
				killAppOnError: true,
				endpoint: ["http://localhost:3002", "http://localhost:3001"],
				method: EMethod.POST
			})),

		new HttpError(-1016, "SERVICE_SHUTTING_DOWN",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true,
				killAppOnError: true,
				endpoint: ["http://localhost:3002", "http://localhost:3001"],
				method: EMethod.POST
			})),

		new HttpError(-1020, "UNSUPPORTED_OPERATION",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1021, "INVALID_TIMESTAMP",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1022, "INVALID_SIGNATURE",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			 })),

		new HttpError(-1100, "ILLEGAL_CHARS",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1101, "TOO_MANY_PARAMETERS",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1102, "MANDATORY_PARAM_EMPTY_OR_MALFORMED",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1103, "UNKNOWN_PARAM",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1104, "UNREAD_PARAMETERS",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1105, "PARAM_EMPTY",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1106, "PARAM_NOT_REQUIRED",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-1130, "INVALID_PARAMETER",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-2008, "BAD_API_ID",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002", "http://localhost:3001"]
			})),

		new HttpError(-2009, "DUPLICATE_API_KEY_DESC",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-2010, "INSUFFICIENT_BALANCE",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: false
			})),

		new HttpError(-2012, "CANCEL_ALL_FAIL",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-2013, "NO_SUCH_ORDER",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),

		new HttpError(-2014, "BAD_API_KEY_FMT",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002", "http://localhost:3001"]
			})),

		new HttpError(-2015, "REJECTED_MBX_KEY",
			new HttpErrorHandler({
				type: EErrorType.Binance,
				sendEmail: true
			})),
	];
	code: number;
	handler?: HttpErrorHandler;
	message: string;

	public static getErrorByCode(code: number): HttpError {
		let result: HttpError;
		if (HttpError.allErrors.length > 0) {
			let filtered: HttpError[] = HttpError.allErrors.filter(handler => handler.code === code);
			if (filtered && filtered.length > 0) {
				result = filtered[0];
			}
		}
		return result;
	}

	private static _getErrorHandler(error: HttpError): HttpErrorHandler | null{
		let match: HttpError[] = HttpError.allErrors.filter(err=>err.code===error.code);
		if(Array.isArray(match) && typeof match[0] === "object" && match[0].handler instanceof HttpErrorHandler){
			return match[0].handler;
		}else{
			return null;
		}
	}

	private static _getErrorParameters(err: BinanceError | HttpError): {code: number, message: string}{
		let code: number = parseInt(err.code.toString());
		let type: EErrorType = HttpError._getErrorType(err);
		let message: string = (type === EErrorType.Binance) ? err['msg'] : err['message'];
		return {code: code, message: message};
	}

	private static _getErrorType(err: BinanceError | HttpError): EErrorType {
		//parseInt(code.toString());
		let code: number = parseInt(err.code.toString());
		let isBinance: boolean = false;
		if (typeof err['msg'] === "string" && code < 0) {
			isBinance = true;
		} else if (typeof err['message'] === "string") {
			isBinance = false;
		}
		return (isBinance) ? EErrorType.Binance : EErrorType.Node;
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

	public static fromError(err: HttpError|BinanceError): HttpError{
		let code: number = parseInt(err.code.toString());
		let type: EErrorType = HttpError._getErrorType(err);
		let message: string = (type === EErrorType.Binance) ? err['msg'] : err['message'];
		let _httpError: HttpError = new HttpError(code, message);
		if(type === EErrorType.Binance && typeof err['handler']==="object"){
			_httpError.handler = err['handler'];
		}
		return _httpError;
	}

	public static isHttpError(err: HttpError|Error){
		return err && err instanceof HttpError;
	}

	constructor(code: number, message: string, handler?:HttpErrorHandler) {
		super();
		this.code = code;
		this.message = message;
		if (handler) {
			this.handler = handler;
		} else {
			let errHandler: HttpErrorHandler|null = HttpError._getErrorHandler(this);
			if(errHandler !== null){
				this.handler = errHandler;
			}
		}
		}
}