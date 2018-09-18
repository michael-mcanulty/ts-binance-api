import {EErrorType} from "./Enums/EErrorType";
import {BinanceError} from "./BinanceError";
import {HttpErrorHandler} from "./HttpErrorHandler";
import {EMethod} from "../Rest/EMethod";
import {IHttpError} from "./Interfaces/IHttpError";
import {IHttpErrorHandler} from "./Interfaces/IHttpErrorHandler";
import {IMessageOptions} from "./Interfaces/IMessageOptions";
import {ISmtpOptions} from "./Interfaces/ISmtpOptions";

export class HttpError extends Error {
	public static fromObjLiteral(err: IHttpError){
		if(!err)return;
		let handler: HttpErrorHandler = new HttpErrorHandler(err.handler);
		return new HttpError(err.code, err.message, handler);
	}
	public static toObjLiteral(err: HttpError){
		if(!err)return;
		let error: IHttpError = <IHttpError>{};
		error.code = err.code;
		error.message = err.message;
		error.handler = <IHttpErrorHandler>{};
		error.handler.emailServiceOpts = err.handler.emailServiceOpts;
		error.handler.emailMsgOpts = err.handler.emailMsgOpts;
		error.handler.endpoint = err.handler.endpoint;
		error.handler.method = EMethod[err.handler.method];
		error.handler.type = EErrorType[err.handler.type];
		error.handler.payload = err.handler.payload;
		error.handler.restartSingleWorker = err.handler.restartSingleWorker;
		error.handler.sendEmail = err.handler.sendEmail;
		return error;
	}
	public static allErrors: HttpError[];
	public static _jsonErrors: IHttpError[] = [
		{
			code: 88880, message: "MongoNetworkError",
			handler: <IHttpErrorHandler> {
				type: EErrorType.MongoDB,
				sendEmail: true,
				//Only kill the worker. The DB is accessed using a worker and only on the data server.
				endpoint: ["http://localhost:3001/kill"],
			}
		},
		{
			code: 127, message: "ECONNREFUSED",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Node,
				sendEmail: false
			}
		},
		{
			code: 401, message: "UNAUTHORIZED",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Node,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/app", "http://localhost:3001/kill/app"],
				method: EMethod.POST
			}
		},
		{
			code: -1000, message: "UNKNOWN",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
			}
		},
		{
			code: -1001, message: "DISCONNECTED",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/workers", "http://localhost:3001/kill/workers"]
			}
		},
		{
			code: -1002, message: "UNAUTHORIZED",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/app", "http://localhost:3001/kill/app"],
				method: EMethod.POST
			}
		},
		{
			code: -1003, message: "TOO_MANY_REQUESTS",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{

			code: -1006, message: "UNEXPECTED_RESP",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{
			code: -1007, message: "TIMEOUT",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3002/kill/workers", "http://localhost:3001/kill/workers"]
			}
		},
		{
			code: -1013, message: "INVALID_MESSAGE",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: false
			}
		},
		{
			code: -1014, message: "UNKNOWN_ORDER_COMPOSITION",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: false
			}
		},
		{
			code: -1015, message: "TOO_MANY_ORDERS",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				restartSingleWorker: true,
				endpoint: ["http://localhost:3001/kill", "http://localhost:3002/kill"],
				method: EMethod.POST
			}
		},
		{
			code: -1016, message: "SERVICE_SHUTTING_DOWN",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"],
				method: EMethod.POST
			}
		},
		{
			code: -1020, message: "UNSUPPORTED_OPERATION",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{
			code: -1021, message: "INVALID_TIMESTAMP",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{
			code: -1022, message: "INVALID_SIGNATURE",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{

			code: -1100, message: "ILLEGAL_CHARS",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{

			code: -1101, message: "TOO_MANY_PARAMETERS",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1102, message: "MANDATORY_PARAM_EMPTY_OR_MALFORMED",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -1103, message: "UNKNOWN_PARAM",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{

			code: -1104, message: "UNREAD_PARAMETERS",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{

			code: -1105, message: "PARAM_EMPTY",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{

			code: -1106, message: "PARAM_NOT_REQUIRED"
			,
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{

			code: -1130, message: "INVALID_PARAMETER",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{

			code: -2008, message: "BAD_API_ID",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
			}
		},
		{

			code: -2009, message: "DUPLICATE_API_KEY_DESC",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
			}
		},
		{

			code: -2010, message: "INSUFFICIENT_BALANCE",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{
			code: -2012, message: "CANCEL_ALL_FAIL",
			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: []
			}
		},
		{

			code: -2013, message: "NO_SUCH_ORDER",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
		{
			code: -2014, message: "BAD_API_KEY_FMT",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true,
				endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
			}
		},
		{

			code: -2015, message: "REJECTED_MBX_KEY",

			handler: <IHttpErrorHandler> {
				type: EErrorType.Binance,
				sendEmail: true
			}
		},
	];
	code: number;
	handler?: HttpErrorHandler;
	message: string;

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
		if(!HttpError.allErrors || HttpError.allErrors.length === 0){
			let match: IHttpError[] = HttpError._jsonErrors.filter(err => err.code === error.code);
			if (Array.isArray(match) && typeof match[0] === "object") {
				return null;
			}
		}else{
			let match: HttpError[] = HttpError.allErrors.filter(err => err.code === error.code);
			if (Array.isArray(match) && typeof match[0] === "object" && typeof match[0].handler === "object" && match[0].handler instanceof HttpErrorHandler) {
				return match[0].handler;
			} else {
				return null;
			}
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
		let _httpError: HttpError = new HttpError(code, message);
		if (type === EErrorType.Binance && typeof err['handler'] === "object") {
			_httpError.handler = err['handler'];
		}
		return _httpError;
	}

	public static getErrorByCode(code: number): HttpError {
		if(!HttpError.allErrors || HttpError.allErrors.length === 0){
			let match: IHttpError[] = HttpError._jsonErrors.filter(err => err.code === code);
			if (Array.isArray(match) && typeof match[0] === "object") {
				return HttpError.fromObjLiteral(match[0]);
			}
		}else{
			let result: HttpError;
			if (HttpError.allErrors.length > 0) {
				let filtered: HttpError[] = HttpError.allErrors.filter(handler => {
					return (typeof code === "number" && handler.code === code);
				});
				if (filtered && filtered.length > 0) {
					result = filtered[0];
				}
			}
			return result;
		}
	}

	public static init(msgOptions?: IMessageOptions, emailServiceOptions?: ISmtpOptions, _jsonErrs?: IHttpError[]) {
		if(_jsonErrs && _jsonErrs.length > 0){
			// This is if you want to set the errors from a DB or sonewhere else
			HttpError._jsonErrors = _jsonErrs
		}
		HttpError.allErrors = HttpError._jsonErrors.map(err => {
			err.handler.emailMsgOpts = msgOptions;
			err.handler.emailServiceOpts = emailServiceOptions;
			return new HttpError(err.code, err.message, new HttpErrorHandler(err.handler))
		});
		return HttpError.allErrors;
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