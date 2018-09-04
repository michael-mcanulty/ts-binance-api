import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./Email/NodeMailer";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";
import {BBLogger} from "../Logger/BBLogger";
import {EErrorType} from "../Error/Email/Enums/EErrorType";
import {HttpError} from "./HttpError";
import {IHttpErrorHandlerOptions} from "./Email/Interfaces/IHttpErrorHandlerOptions";
import {IHandleExceptionOptions} from "./Email/Interfaces/IHandleExceptionOptions";
import {ISMTPOptions} from "./Email/Interfaces/ISMTPOptions";

export class HttpErrorHandler {
	public static mailService: NodeMailer;
	public static emailMsgOptions: IMessageOptions;
	public static emailServiceOptions: ISMTPOptions;
	type: string;
	sendEmail: boolean;
	killAppOnError?: boolean;
	emailMsgOpts?: IMessageOptions;
	emailServiceOpts?: ISMTPOptions;
	killWorkerOnError: boolean;
	endpoint?: string[]|string;
	method?: EMethod;
	payload?: any;

	public static hasHandler(err: HttpError){
		return (err && HttpError.isHttpError(err) && err.handler instanceof HttpErrorHandler);
	}

	execute(options: IHandleExceptionOptions): Promise<any> {
		return new Promise(async (resolve, reject) => {

			if ( (this.method != undefined && this.method !== null) && this.endpoint) {
				let _endpoint: string[] = (Array.isArray(this.endpoint))?<string[]>this.endpoint:<string[]>new Array(this.endpoint);
				let reqOpts: RequestInit = <RequestInit>{};
				reqOpts.method = EMethod[this.method];
				reqOpts.headers = new Headers();
				reqOpts.headers.set("Content-Type", "application/json");
				reqOpts.body = this.payload || null;
				if(!this.killAppOnError && this.payload || (this.killWorkerOnError && options.workerId)){
					reqOpts.body = (this.payload)?JSON.stringify(this.payload): JSON.stringify({"workerId": options.workerId});
				}

				//Send an email
				if (this.sendEmail && this.emailMsgOpts && (this.emailServiceOpts || HttpErrorHandler.emailServiceOptions)) {
					HttpErrorHandler.mailService = new NodeMailer();
					this.emailMsgOpts.subject = (!this.emailMsgOpts.subject || this.emailMsgOpts.subject.length === 0 )? `${options.message} ${this.type || "Unknown"} Error Received`: this.emailMsgOpts.subject;
					this.emailMsgOpts.text =(!this.emailMsgOpts.text || this.emailMsgOpts.text.length === 0 )?`Error code: ${options.code} \n Message: ${options.message}`: this.emailMsgOpts.text;
					let defaultServiceOpts: ISMTPOptions = HttpErrorHandler.emailServiceOptions;

					try {
						await HttpErrorHandler.mailService.sendEmail(this.emailMsgOpts, this.emailServiceOpts || defaultServiceOpts);
					} catch (err) {
						BBLogger.error(err);
						reject(err);
					}
				}

				for(let endpoint of _endpoint){
					try {
						let fetch: any = {};
						fetch = await BotHttp.fetch(endpoint, reqOpts);
					} catch (err) {
						if(err && typeof err.errno === "string" && err.errno !== "ECONNREFUSED"){
							BBLogger.error(err.message);
							reject(err);
						}else{
							BBLogger.warning("Tried to kill a dead server.");
						}
					}
				}
			}

			resolve();
		});
	}

	constructor(config: IHttpErrorHandlerOptions) {
		this.emailServiceOpts	= HttpErrorHandler.emailServiceOptions;
		this.emailMsgOpts	= (HttpErrorHandler.emailMsgOptions)? HttpErrorHandler.emailMsgOptions: <IMessageOptions>{};

		if(config){
			if(config.endpoint){
				this.endpoint = (Array.isArray(config.endpoint))?<string[]>config.endpoint:<string[]>new Array(config.endpoint);
			}
			this.method = config.method;
			this.type = EErrorType[config.type] || EErrorType[EErrorType.Binance];
			this.sendEmail = config.sendEmail;
			this.payload = config.payload;
			this.killAppOnError = config.killAppOnError;
			this.killWorkerOnError = config.killWorkerOnError;

			if(config.emailServiceOpts && typeof config.emailServiceOpts.auth === "object"){
				this.emailServiceOpts = config.emailServiceOpts;
			}

			this.emailMsgOpts = config.emailMsgOpts;
		}
	}
}