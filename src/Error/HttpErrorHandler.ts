import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./Email/NodeMailer";
import {IEmailOptions} from "./Email/Interfaces/IServiceOprtions";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";
import {BinanceError} from "./BinanceError";
import {HttpError} from "./HttpError";
import {EErrorType} from "./Email/Enums/EErrorType";

export class HttpErrorHandler {
	code: number;
	emailAddress?: string;
	emailOptions?: IEmailOptions;
	private static emailService: NodeMailer;
	endpoint: string;
	message: string;
	method: string;
	payload?: any[];
	port: number;
	sendEmail: boolean;
	type: string;
	url: string;

	public static allErrors = [
		{
			"message": "UNKNOWN",
			"code": -1000,
			handler: new HttpErrorHandler(-1000, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "DISCONNECTED",
			"code": -1001,
			handler: new HttpErrorHandler(-1001, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "UNAUTHORIZED",
			"code": -1002,
			handler: new HttpErrorHandler(-1002, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "TOO_MANY_REQUESTS",
			"code": -1003,
			handler: new HttpErrorHandler(-1003, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "UNEXPECTED_RESP",
			"code": -1006,
			handler: new HttpErrorHandler(-1006, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "TIMEOUT",
			"code": -1007,
			handler: new HttpErrorHandler(-1007, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "INVALID_MESSAGE",
			"code": -1013,
			handler: new HttpErrorHandler(-1013, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "UNKNOWN_ORDER_COMPOSITION",
			"code": -1014,
			handler: new HttpErrorHandler(1014, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "TOO_MANY_ORDERS",
			"code": -1015,
			handler: new HttpErrorHandler(-1015, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "SERVICE_SHUTTING_DOWN",
			"code": -1016,
			handler: new HttpErrorHandler(-1016, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "UNSUPPORTED_OPERATION",
			"code": -1020,
			handler: new HttpErrorHandler(-1020, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "INVALID_TIMESTAMP",
			"code": -1021,
			handler: new HttpErrorHandler(-1021, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "INVALID_SIGNATURE",
			"code": -1022,
			handler: new HttpErrorHandler(-1022, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "ILLEGAL_CHARS",
			"code": -1100,
			handler: new HttpErrorHandler(-1100, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "TOO_MANY_PARAMETERS",
			"code": -1101,
			handler: new HttpErrorHandler(-1101, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "MANDATORY_PARAM_EMPTY_OR_MALFORMED",
			"code": -1102,
			handler: new HttpErrorHandler(-1102, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "UNKNOWN_PARAM",
			"code": -1103,
			handler: new HttpErrorHandler(-1103, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "UNREAD_PARAMETERS",
			"code": -1104,
			handler: new HttpErrorHandler(-1104, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "PARAM_EMPTY",
			"code": -1105,
			handler: new HttpErrorHandler(-1105, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "PARAM_NOT_REQUIRED",
			"code": -1106,
			handler: new HttpErrorHandler(-1106, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "INVALID_PARAMETER",
			"code": -1130,
			handler: new HttpErrorHandler(-1130, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "BAD_API_ID",
			"code": -2008,
			handler: new HttpErrorHandler(-2008, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "DUPLICATE_API_KEY_DESC",
			"code": -2009,
			handler: new HttpErrorHandler(-2009, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "INSUFFICIENT_BALANCE",
			"code": -2010,
			handler: new HttpErrorHandler(-2010, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "CANCEL_ALL_FAIL",
			"code": -2012,
			handler: new HttpErrorHandler(-2012, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "NO_SUCH_ORDER",
			"code": -2013,
			handler: new HttpErrorHandler(-2013, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "BAD_API_KEY_FMT",
			"code": -2014,
			handler: new HttpErrorHandler(-2014, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		},
		{
			"message": "REJECTED_MBX_KEY",
			"code": -2015,
			handler: new HttpErrorHandler(-2015, "http://localhost", 4001, EErrorType.Binance, EMethod.GET, false)
		}];
	handleError(error: BinanceError | HttpError): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (this.port !== null && this.method !== null) {
				let url: string = this.url;
				let reqOpts: RequestInit = <RequestInit>{};
				reqOpts.method = EMethod[this.method];
				reqOpts.headers = new Headers();

				if (this.payload && this.payload.length > 0) {
					url = BotHttp.buildUrl(this.url, false, this.payload);
				}

				if (this.sendEmail && this.emailOptions) {
					HttpErrorHandler.emailService = new NodeMailer(this.emailOptions);
					let msgOptions: IMessageOptions = <IMessageOptions>{};
					msgOptions.from = this.emailAddress;
					msgOptions.to = this.emailAddress;
					let message: string = (this.type === EErrorType[EErrorType.Binance]) ? error['msg'] : error['message'];
					msgOptions.subject = `A new ${EErrorType[this.type] || "Unknown"} error has been received | ${message}`;
					msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${error.code} \n Message: ${message}`;

					try {
						await HttpErrorHandler.emailService.sendEmail(msgOptions);
					} catch (err) {
						reject(err);
					}
				}
				try {
					let fetch: any = {};
					//fetch = await BotHttp.fetch(url, reqOpts);
					resolve(fetch);
				} catch (err) {
					reject(err);
				}
			}
		});
	}

	constructor(code: number, endpoint: string, port: number, type: EErrorType, method: EMethod, sendEmail: boolean, emailAddress?: string, emailOptions?: IEmailOptions) {
		this.code = code;
		this.type = EErrorType[type];
		this.port = port || null;
		this.method = EMethod[method];
		this.emailAddress = emailAddress || null;
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint;
		this.url = `${this.endpoint}:${this.port}`;
	}
}
