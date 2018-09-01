import {EErrorType} from "./Email/Enums/EErrorType";
import {BinanceError} from "./BinanceError";
import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./Email/NodeMailer";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";
import {ServiceOptions} from "./Email/ServiceOptions";
import {BBLogger} from "..";

export class HttpErrorHandler {
	private static _nodeMailerService: NodeMailer;
	public static defaultErrMsgRecipient: string;
	public static defaultEmailServiceOpts: ServiceOptions;
	endpoint?: string;
	method?: string;
	payload?: any[];
	port?: number;
	sendEmail?: boolean;
	emailMsgOpts?: IMessageOptions;
	type: string;
	emailServiceOpts?: ServiceOptions;

	private readonly _url?: string;

	get url(): string {
		return `${this.endpoint}:${this.port}`
	}

	handleError(code: number, message: string): Promise<any> {
		return new Promise(async (resolve, reject) => {

			//posts message via REST
			if (this.port && this.method) {
				let url: string = this.url;
				let reqOpts: RequestInit = <RequestInit>{};
				reqOpts.method = EMethod[this.method];
				reqOpts.headers = new Headers();

				if (this.payload && this.payload.length > 0) {
					url = BotHttp.buildUrl(this._url, false, this.payload);
				}

				try {
					let fetch: any = {};
					fetch = await BotHttp.fetch(url, reqOpts);
				} catch (err) {
					BBLogger.error(err);
					reject(err);
				}
			}

			//Send an email
			if (this.sendEmail && this.emailMsgOpts && this.emailServiceOpts) {
				HttpErrorHandler._nodeMailerService = new NodeMailer();
				this.emailMsgOpts.subject = (!this.emailMsgOpts.subject || this.emailMsgOpts.subject.length === 0 )? `A new ${EErrorType[this.type] || "Unknown"} error has been received | ${message}`: this.emailMsgOpts.subject;
				this.emailMsgOpts.text =(!this.emailMsgOpts.text || this.emailMsgOpts.text.length === 0 )?`${new Date().toLocaleDateString()} : \n Code: ${code} \n Message: ${message}`: this.emailMsgOpts.text;

				try {
					await HttpErrorHandler._nodeMailerService.sendEmail(this.emailMsgOpts, this.emailServiceOpts);
				} catch (err) {
					BBLogger.error(err);
					reject(err);
				}
			}
			resolve();
		});
	}

	constructor(
		type: EErrorType,
		method?: EMethod,
		port?: number,
		sendEmail?: boolean,
		endpoint?: string,
		emailMsgOpts?: IMessageOptions,
		emailServiceOpts?: ServiceOptions
	) {
		let msgOpts: IMessageOptions = <IMessageOptions>{};
		msgOpts.to = HttpErrorHandler.defaultErrMsgRecipient;
		this.type = EErrorType[type];
		this.method = EMethod[method];
		this.port = port;
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint;
		this.emailMsgOpts = emailMsgOpts || msgOpts;
		this.emailServiceOpts = emailServiceOpts || HttpErrorHandler.defaultEmailServiceOpts;

		if (this.endpoint && this.port) {
			this._url = `${this.endpoint}:${this.port}`;
		} else {
			this._url = null;
		}
	}
}

export class HttpError extends Error {
	public static allErrors: HttpError[] = [
		new HttpError(-1000, "UNKNOWN", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1001, "DISCONNECTED", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1002, "UNAUTHORIZED", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1003, "TOO_MANY_REQUESTS", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1006, "UNEXPECTED_RESP", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1007, "TIMEOUT", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1013, "INVALID_MESSAGE", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1014, "UNKNOWN_ORDER_COMPOSITION", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1015, "TOO_MANY_ORDERS", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1016, "SERVICE_SHUTTING_DOWN", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1020, "UNSUPPORTED_OPERATION", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1021, "INVALID_TIMESTAMP", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1022, "INVALID_SIGNATURE", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1100, "ILLEGAL_CHARS", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1101, "TOO_MANY_PARAMETERS", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1102, "MANDATORY_PARAM_EMPTY_OR_MALFORMED", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1103, "UNKNOWN_PARAM", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1104, "UNREAD_PARAMETERS", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1105, "PARAM_EMPTY", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1106, "PARAM_NOT_REQUIRED", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-1130, "INVALID_PARAMETER", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-2008, "BAD_API_ID", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-2009, "DUPLICATE_API_KEY_DESC", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-2010, "INSUFFICIENT_BALANCE", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-2012, "CANCEL_ALL_FAIL", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-2013, "NO_SUCH_ORDER", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-2014, "BAD_API_KEY_FMT", new HttpErrorHandler(EErrorType.Binance)),
		new HttpError(-2015, "REJECTED_MBX_KEY", new HttpErrorHandler(EErrorType.Binance))
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
		if(Array.isArray(match)&& typeof match[0].handler === "object"){
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

				//TODO remove ifee
				(async()=>{
					await this.handler.handleError(code, message);
				})()
			}
		}
		}
}
