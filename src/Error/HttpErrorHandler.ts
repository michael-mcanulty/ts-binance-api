import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./Email/NodeMailer";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";
import {ServiceOptions} from "./Email/ServiceOptions";
import {BBLogger} from "../Logger/BBLogger";
import {EErrorType} from "../Error/Email/Enums/EErrorType";
import {HttpError} from "./HttpError";
import {IHttpErrorHandlerOptions} from "./Email/Interfaces/IHttpErrorHandlerOptions";
import {IHandleExceptionOpts} from "./Email/Interfaces/IHandleExceptionOpts";

export class HttpErrorHandler {
	public static mailService: NodeMailer;
	public static defaultErrMsgRecipient: string;
	public static defaultEmailServiceOpts: ServiceOptions;
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
		return HttpError.isHttpError(err) && err.handler instanceof HttpError;
	}

	handleException(code: number, message: string, opts?: IHandleExceptionOpts): Promise<any> {
		return new Promise(async (resolve, reject) => {
			if(opts.endpoint)this.endpoint = opts.endpoint;
			if(opts.method)this.method = opts.method;
			if(opts.payload)this.payload = opts.payload;

			if ( (this.method != undefined && this.method !== null) && this.endpoint) {
				let _endpoint: string[] = (Array.isArray(opts.endpoint))?<string[]>opts.endpoint:<string[]>new Array(opts.endpoint);
				this.method = opts.method;
				let reqOpts: RequestInit = <RequestInit>{};
				let url: string;
				reqOpts.method = EMethod[this.method];
				reqOpts.headers = <Headers>{};
				reqOpts.headers.set("Content-Type", "application/json");
				reqOpts.body = null;
				if(this.payload || (this.killWorkerOnError && opts.workerId)){
					reqOpts.body = (this.payload)?JSON.stringify(this.payload): JSON.stringify({"workerId": opts.workerId});
				}

				for(let endpoint of _endpoint){
					try {
						let fetch: any = {};
						fetch = await BotHttp.fetch(endpoint, reqOpts);
					} catch (err) {
						BBLogger.error(err);
						reject(err);
					}
				}
			}

			//Send an email
			if (this.sendEmail && this.emailMsgOpts && this.emailServiceOpts) {
				HttpErrorHandler.mailService = new NodeMailer();
				this.emailMsgOpts.subject = (!this.emailMsgOpts.subject || this.emailMsgOpts.subject.length === 0 )? `A new ${EErrorType[this.type] || "Unknown"} error has been received | ${message}`: this.emailMsgOpts.subject;
				this.emailMsgOpts.text =(!this.emailMsgOpts.text || this.emailMsgOpts.text.length === 0 )?`${new Date().toLocaleDateString()} : \n Code: ${code} \n Message: ${message}`: this.emailMsgOpts.text;

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
		let msgOpts: IMessageOptions = <IMessageOptions>{};
		msgOpts.to = HttpErrorHandler.defaultErrMsgRecipient;

		if(config){
			if(config.endpoint){
				this.endpoint = (Array.isArray(config.endpoint))?<string[]>config.endpoint:<string[]>new Array(config.endpoint);
			}
			this.type = EErrorType[config.type] || EErrorType[EErrorType.Binance];
			this.sendEmail = config.sendEmail;
			this.emailServiceOpts = HttpErrorHandler.defaultEmailServiceOpts;

			if(config.emailServiceOpts && typeof config.emailServiceOpts.auth === "object"){
				this.emailServiceOpts = new ServiceOptions(config.emailServiceOpts);
			}

			this.emailMsgOpts = config.emailMsgOpts || msgOpts;
		}
	}
}