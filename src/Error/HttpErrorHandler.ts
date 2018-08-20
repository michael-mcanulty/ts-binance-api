import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./Email/NodeMailer";
import {IEmailOptions} from "./Email/Interfaces/IServiceOprtions";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";
import {EErrorType} from "./Email/Enums/EErrorType";

export class HttpErrorHandler {
	private static _emailService: NodeMailer;
	public static allErrors: HttpErrorHandler[] = [
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
		new HttpErrorHandler(EMethod.GET, EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com")
	];
	static emailOptions?: IEmailOptions;
	endpoint?: string;
	method?: string;
	payload?: any[];
	port?: number;
	recipientEmail?: string;
	sendEmail?: boolean;
	type?: string;

	private readonly _url?: string;

	get url(): string {
		return `${this.endpoint}:${this.port}`
	}

	handleError(code: number, message: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if (this.port !== null && this.method !== null) {
				let url: string = this._url;
				let reqOpts: RequestInit = <RequestInit>{};
				reqOpts.method = EMethod[this.method];
				reqOpts.headers = new Headers();

				if (this.payload && this.payload.length > 0) {
					url = BotHttp.buildUrl(this._url, false, this.payload);
				}

				if (this.sendEmail && HttpErrorHandler.emailOptions) {
					let msgOptions: IMessageOptions = <IMessageOptions>{};
					HttpErrorHandler._emailService = new NodeMailer(HttpErrorHandler.emailOptions);
					msgOptions.from = this.recipientEmail;
					msgOptions.to = this.recipientEmail;
					msgOptions.subject = `A new ${EErrorType[this.type] || "Unknown"} error has been received | ${message}`;
					msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${code} \n Message: ${message}`;

					try {
						await HttpErrorHandler._emailService.sendEmail(msgOptions);
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

	constructor(
		method?: EMethod,
		type?: EErrorType,
		port?: number,
		sendEmail?: boolean,
		endpoint?: string,
		recipientEmail?: string
	) {
		this.method = EMethod[method] || EMethod[EMethod.GET];
		this.type = EErrorType[type] || EErrorType[EErrorType.Binance];

		this.port = port || 4001;
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint || "http://localhost";
		this.recipientEmail = recipientEmail;

		if (this.endpoint && this.port) {
			this._url = `${this.endpoint}:${this.port}`;
		} else {
			this._url = null;
		}
	}
}
