import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./Email/NodeMailer";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";
import {ServiceOptions} from "./Email/ServiceOptions";
import {BBLogger} from "../Logger/BBLogger";
import {IServiceOptions} from "./Email/Interfaces/IServiceOptions";
import {EErrorType} from "../../dist/Error/Email/Enums/EErrorType";

export class HttpErrorHandler {
	public static mailService: NodeMailer;
	public static defaultErrMsgRecipient: string;
	public static defaultEmailServiceOpts: ServiceOptions;
	endpoint?: string[];
	method?: string;
	payload?: any;
	killAppOnError?: boolean;
	emailMsgOpts?: IMessageOptions;
	emailServiceOpts?: ServiceOptions;
	killWorkerOnError: boolean;
	sendEmail: boolean;
	type: string;

	handleException(code: number, message: string, method: EMethod, endpoint: string[]|string, workerId: number): Promise<any> {
		return new Promise(async (resolve, reject) => {
			//posts message via REST
			if (method != undefined && endpoint) {
				this.method = EMethod[method];
				this.endpoint = (Array.isArray(endpoint))?<string[]>endpoint:<string[]>[endpoint];
				let reqOpts: RequestInit = <RequestInit>{};
				let url: string;
				reqOpts.method = this.method;
				reqOpts.headers = {"Content-Type": "application/json"};
				reqOpts.body = null;
				if(this.payload || (this.killWorkerOnError && workerId)){
					reqOpts.body = (this.payload)?JSON.stringify(this.payload): JSON.stringify({"workerId": workerId});
				}

				for(let endpoint of this.endpoint){
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

	constructor(
		type: EErrorType,
		sendEmail?: boolean,
		endpoint?: string[],
		emailServiceOpts?: IServiceOptions,
		emailMsgOpts?: IMessageOptions
	) {
		let msgOpts: IMessageOptions = <IMessageOptions>{};
		msgOpts.to = HttpErrorHandler.defaultErrMsgRecipient;
		this.type = EErrorType[type];
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint;
		this.emailServiceOpts = new ServiceOptions(emailServiceOpts) || HttpErrorHandler.defaultEmailServiceOpts;
		this.emailMsgOpts = emailMsgOpts || msgOpts;
	}
}