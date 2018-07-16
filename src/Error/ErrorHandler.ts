import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./Email/NodeMailer";
import {IServiceOptions} from "./Email/Interfaces/IServiceOprtions";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";
import {BinanceError} from "./BinanceError";
import {HttpError} from "./HttpError";
import {EErrorType} from "./Email/Enums/EErrorType";

export class ErrorHandler {
	public static allItems: ErrorHandler[];
	code: number;
	emailAddress?: string;
	emailOptions?: IServiceOptions;
	private static emailService: NodeMailer;
	endpoint: string;
	method: EMethod;
	port: number;
	restart: boolean;
	sendEmail: boolean;
	shutdown: boolean;
	timeout: number;
	type: EErrorType;
	protected url: string;

	public static GetErrorHandler(code: number, type: EErrorType): ErrorHandler {
		let result: ErrorHandler;
		if (ErrorHandler.allItems && ErrorHandler.allItems.length > 0) {
			let filtered: ErrorHandler[] = ErrorHandler.allItems.filter(handler => {
				return handler.code === code && handler.type === type
			});
			if (filtered && filtered.length > 0) {
				result = filtered[0];
			}
		}
		return result;
	}

	executeApi(error: BinanceError | HttpError): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (this.port !== null && this.method !== null) {
				let reqOpts: RequestInit = <RequestInit>{};
				reqOpts.method = EMethod[this.method];
				reqOpts.headers = new Headers();

				if (this.sendEmail && this.emailOptions) {
					ErrorHandler.emailService = new NodeMailer(this.emailOptions);
					let msgOptions: IMessageOptions = <IMessageOptions>{};
					msgOptions.from = this.emailAddress;
					msgOptions.to = this.emailAddress;
					let message: string = (this.type === EErrorType.Binance) ? error['msg'] : error['message'];
					msgOptions.subject = `A new ${EErrorType[this.type] || "Unknown"} error has been received | ${message}`;
					msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${error.code} \n Message: ${message}`;
					try {
						await ErrorHandler.emailService.sendEmail(msgOptions);
					} catch (err) {
						reject(err);
					}
				}
				try {
					let fetch = await BotHttp.fetch(this.url, reqOpts);
					resolve(fetch);
				} catch (err) {
					reject(err);
				}
			}
		});
	}

	constructor(code: number, port: number, type: EErrorType, method: EMethod, sendEmail: boolean, timeout?: number, emailAddress?: string, emailOptions?: IServiceOptions, endpoint = "http://localhost") {
		this.type = type;
		this.code = code;
		this.port = port || null;
		this.method = method;
		this.emailAddress = emailAddress || null;
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint;
		this.timeout = timeout || 0;
		let url: string = `${this.endpoint}:${this.port}`;
		let props: any = {"timeout": this.timeout, "restart": this.restart, "shutdown": this.shutdown};
		url += BotHttp.makeQueryString(props);
		this.url = url;
	}
}
