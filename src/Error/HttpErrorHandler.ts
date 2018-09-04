import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./Email/NodeMailer";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";
import {ServiceOptions} from "./Email/ServiceOptions";
import {BBLogger} from "../Logger/BBLogger";
import {EErrorType} from "../Error/Email/Enums/EErrorType";
import {HttpError} from "./HttpError";
import {IHttpErrorHandlerOptions} from "./Email/Interfaces/IHttpErrorHandlerOptions";
import {IHandleExceptionOptions} from "./Email/Interfaces/IHandleExceptionOptions";
import {IServiceOptions} from "../Error/Email/Interfaces/IServiceOptions";

export class HttpErrorHandler {
	public static mailService: NodeMailer;
	public static emailMsgOptions: IMessageOptions;
	public static emailServiceOptions: IServiceOptions;
	type: string;
	sendEmail: boolean;
	killAppOnError?: boolean;
	emailMsgOpts?: IMessageOptions;
	emailServiceOpts?: ServiceOptions;
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

				for(let endpoint of _endpoint){
					try {
						let fetch: any = {};
						fetch = await BotHttp.fetch(endpoint, reqOpts);
					} catch (err) {
						BBLogger.warning(err);
					}
				}
			}

			//Send an email
			if (this.sendEmail && this.emailMsgOpts && this.emailServiceOpts) {
				HttpErrorHandler.mailService = new NodeMailer();
				this.emailMsgOpts.subject = (!this.emailMsgOpts.subject || this.emailMsgOpts.subject.length === 0 )? `A new ${EErrorType[this.type] || "Unknown"} error has been received | ${options.message}`: this.emailMsgOpts.subject;
				this.emailMsgOpts.text =(!this.emailMsgOpts.text || this.emailMsgOpts.text.length === 0 )?`${new Date().toLocaleDateString()} : \n Code: ${options.code} \n Message: ${options.message}`: this.emailMsgOpts.text;

				try {
					await HttpErrorHandler.mailService.sendEmail(this.emailMsgOpts, this.emailServiceOpts);
				} catch (err) {
					BBLogger.error(err);
					reject(err);
				}
			}
			resolve();
		});
	}

	constructor(config: IHttpErrorHandlerOptions) {
		this.emailServiceOpts	= (HttpErrorHandler.emailServiceOptions)? new ServiceOptions(HttpErrorHandler.emailServiceOptions): new ServiceOptions(<IServiceOptions>{});
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
				this.emailServiceOpts = new ServiceOptions(config.emailServiceOpts);
			}

			this.emailMsgOpts = config.emailMsgOpts;
		}
	}
}