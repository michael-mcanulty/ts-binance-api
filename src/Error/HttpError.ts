import {EErrorType} from "./Email/Enums/EErrorType";
import {BinanceError} from "./BinanceError";
import {HttpErrorHandler} from "./HttpErrorHandler";
import {EMethod} from "../Rest/EMethod";
import {IHttpError} from "./Email/Interfaces/IHttpError";

export class HttpError extends Error {
	public static allErrors: HttpError[] = [];
	code: number;
	handler?: HttpErrorHandler;
	message: string;
	public httpErrors:IHttpError[] = [
		{
			code: 3001, message: "DATASERVER_ECONNREFUSED",
			handler: {
				type: EErrorType.Node,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/app", "http://localhost:3001/kill/app"]
			}
		},
		{
			code: 127, message: "ECONNREFUSED",
			handler: {
				type: EErrorType.Node,
				sendEmail: false,
				endpoint: []
			}
		},
		{
			code: 401, message: "UNAUTHORIZED",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/app", "http://localhost:3001/kill/app"],
				method: EMethod.POST
			}
		},
		{
			code: -1000, message: "UNKNOWN",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
			}
		},
		{
			code: -1001, message: "DISCONNECTED",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/workers", "http://localhost:3001/kill/workers"]
			}
		},
		{
			code: -1002, message: "UNAUTHORIZED",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/app", "http://localhost:3001/kill/app"],
				method: EMethod.POST
			}
		},
		{
			code: -1003, message: "TOO_MANY_REQUESTS",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1006, message: "UNEXPECTED_RESP",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{
			code: -1007, message: "TIMEOUT",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/workers", "http://localhost:3001/kill/workers"]
			}
		},
		{
			code: -1013, message: "INVALID_MESSAGE",
			handler: {
				type: EErrorType.Binance,
				sendEmail: false,
				endpoint: []
			}
		},
		{
			code: -1014, message: "UNKNOWN_ORDER_COMPOSITION",
			handler: {
				type: EErrorType.Binance,
				sendEmail: false,
				endpoint: []
			}
		},
		{
			code: -1015, message: "TOO_MANY_ORDERS",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/worker", "http://localhost:3002/kill/worker"],
				method: EMethod.POST
			}
		},
		{
			code: -1016, message: "SERVICE_SHUTTING_DOWN",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"],
				method: EMethod.POST
			}
		},
		{
			code: -1020, message: "UNSUPPORTED_OPERATION",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{
			code: -1021, message: "INVALID_TIMESTAMP",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{
			code: -1022, message: "INVALID_SIGNATURE",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1100, message: "ILLEGAL_CHARS",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1101, message: "TOO_MANY_PARAMETERS",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1102, message: "MANDATORY_PARAM_EMPTY_OR_MALFORMED",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1103, message: "UNKNOWN_PARAM",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1104, message: "UNREAD_PARAMETERS",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1105, message: "PARAM_EMPTY",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1106, message: "PARAM_NOT_REQUIRED"
			,
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1130, message: "INVALID_PARAMETER",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -2008, message: "BAD_API_ID",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
			}
		},
		{

			code: -2009, message: "DUPLICATE_API_KEY_DESC",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
			}
		},
		{

			code: -2010, message: "INSUFFICIENT_BALANCE",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{
			code: -2012, message: "CANCEL_ALL_FAIL",
			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -2013, message: "NO_SUCH_ORDER",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{
			code: -2014, message: "BAD_API_KEY_FMT",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
			}
		},
		{

			code: -2015, message: "REJECTED_MBX_KEY",

			handler: {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
	];

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

	private static _getErrorHandler(error: HttpError): HttpErrorHandler | null {
		let match: HttpError[] = HttpError.allErrors.filter(err => err.code === error.code);
		if (Array.isArray(match) && typeof match[0] === "object" && typeof match[0].handler === "object" && match[0].handler instanceof HttpErrorHandler) {
			return match[0].handler;
		} else {
			return null;
		}
	}

	private static _getErrorParameters(err: BinanceError | HttpError): { code: number, message: string } {
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

	public static fromError(err: HttpError | BinanceError): HttpError {
		let code: number = parseInt(err.code.toString());
		let type: EErrorType = HttpError._getErrorType(err);
		let message: string = (type === EErrorType.Binance) ? err['msg'] : err['message'];
		let _
		HttpError = new HttpError(code, message);
		if (type === EErrorType.Binance && typeof err['handler'] === "object") {
			_httpError.handler = err['handler'];
		}
		return _httpError;
	}

	public static getErrorByCode(code: number): HttpError {
		let result: HttpError;
		if (HttpError.allErrors.length > 0) {
			let filtered: HttpError[] = HttpError.allErrors.filter(handler => {
				return (typeof code === "number" && handler.code === code)
			});
			if (filtered && filtered.length > 0) {
				result = filtered[0];
			}
		}
		return result;
	}

	public static isHttpError(err: HttpError | Error) {
		return err && err instanceof HttpError;
	}

	constructor(code: number, message: string, handler?: HttpErrorHandler) {
		super();
		this.code = code;
		this.message = message;

		if (handler) {
			this.handler = handler;
		} else {
			let errHandler: HttpErrorHandler | null = HttpError._getErrorHandler(this);
			if (errHandler !== null) {
				this.handler = errHandler;
			}
		}
	}
}