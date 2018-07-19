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
	emailOptions?: IEmailOptions;
	emailAddress?: string;
	message: string;
	private static emailService: NodeMailer;
	endpoint: string;
	method: string;
	port: number;
	sendEmail: boolean;
	payload?:any[];
	type: string;
	url: string;
	urlParams?:any[];

	executeApi(error: BinanceError | HttpError): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (this.port !== null && this.method !== null) {
				let reqOpts: RequestInit = <RequestInit>{};
				reqOpts.method = EMethod[this.method];
				reqOpts.headers = new Headers();

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
					let fetch = await BotHttp.fetch(this.url, reqOpts);
					resolve(fetch);
				} catch (err) {
					reject(err);
				}
			}
		});
	}

	constructor(code: number, endpoint:string, port: number, type: EErrorType, method: EMethod, sendEmail: boolean, emailAddress?: string, emailOptions?: IEmailOptions) {
		this.code = code;
		this.type = EErrorType[type];
		this.port = port || null;
		this.method =EMethod[method];
		this.emailAddress = emailAddress || null;
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint;
		this.url = `${this.endpoint}:${this.port}`;
	}
}

//TODO:
//-1013 only 9xxxxxx is on binance INVALID_MESSAGE is -1013
//Filter Failure: MIN_NOTATIONAL
//NOT MEETING BTC MIN purchase QTY
