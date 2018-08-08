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
