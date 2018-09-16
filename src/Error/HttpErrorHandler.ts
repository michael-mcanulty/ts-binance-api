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
import {URL} from "url";

export class HttpErrorHandler {
	public static mailService: NodeMailer;
	public static emailMsgOptions: IMessageOptions;
	public static emailServiceOptions: ISMTPOptions;
	type: string;
	sendEmail: boolean;
	emailMsgOpts?: IMessageOptions;
	emailServiceOpts?: ISMTPOptions;
	endpoint?: string[]|string;
	method?: EMethod;
	payload?: any;

	public static hasHandler(err: HttpError){
		return (err && HttpError.isHttpError(err) && err.handler instanceof HttpErrorHandler);
	}

	execute(err: HttpError, srcUrl: URL): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try{

				//"http://localhost:3001"
				let origin = srcUrl.origin;

				if (err && HttpErrorHandler.hasHandler(err)) {
					if (typeof err.handler === "object") {

						if (err.handler.emailMsgOpts) {
							err.handler.emailMsgOpts = HttpErrorHandler.emailMsgOptions;
						}

						if (!err.handler.emailServiceOpts || !err.handler.emailServiceOpts.auth) {
							err.handler.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
						}
						let opts: IHandleExceptionOptions = <IHandleExceptionOptions>{};
						opts.code = err.code;
						opts.message = err.message;

						let remoteEndpoints: string[] = [];
						let _endpoint: string[];

						if ((this.method != undefined && this.method !== null) && this.endpoint) {
							_endpoint = (Array.isArray(this.endpoint)) ? <string[]>this.endpoint : <string[]>new Array(this.endpoint);
							remoteEndpoints = _endpoint;
							if (origin && _endpoint.length > 1) {
								remoteEndpoints = _endpoint.filter(e => new URL(e).origin !== origin);
							}
						}

						let reqOpts: RequestInit = <RequestInit>{};
						reqOpts.method = EMethod[this.method];
						reqOpts.headers = new Headers();
						reqOpts.headers.set("Content-Type", "application/json");
						reqOpts.body = this.payload || null;

						//Send an email
						if (this.sendEmail && this.emailMsgOpts && (this.emailServiceOpts || HttpErrorHandler.emailServiceOptions)) {
							HttpErrorHandler.mailService = new NodeMailer();
							this.emailMsgOpts.subject = (!this.emailMsgOpts.subject || this.emailMsgOpts.subject.length === 0) ? `${opts.message} ${this.type || "Unknown"} Error Received` : this.emailMsgOpts.subject;
							this.emailMsgOpts.text = (!this.emailMsgOpts.text || this.emailMsgOpts.text.length === 0) ? `Error code: ${opts.code} \n Message: ${opts.message}` : this.emailMsgOpts.text;
							let defaultServiceOpts: ISMTPOptions = HttpErrorHandler.emailServiceOptions;

							await HttpErrorHandler.mailService.sendEmail(this.emailMsgOpts, this.emailServiceOpts || defaultServiceOpts);

							//Kamikaze style. Destroy endpoints with suicide on last post.
							for (let ePoint of remoteEndpoints) {
								await postToEndpoint(ePoint, reqOpts, reject);
							}

							//Suicidal final post.
							if (origin && _endpoint.length > remoteEndpoints.length) {
								let lastPoint: string[] = _endpoint.filter(e => new URL(e).origin === origin);
								if(lastPoint && lastPoint.length > 0){
									await postToEndpoint(lastPoint[0], reqOpts, reject);
								}
							}
						}
					}
				}
				resolve();

			}catch(err){
				await BBLogger.error(err);
				reject(err);
			}
		});
		async function postToEndpoint(endpoint: string, reqOpts: RequestInit, errorCallback: Function){
			try {
				let fetch: any = {};
				fetch = await BotHttp.fetch(endpoint, reqOpts);
			} catch (err) {
				if(err && typeof err.errno === "string" && err.errno !== "ECONNREFUSED"){
					await BBLogger.error(err.message);
					errorCallback(err);
				}else{
					await BBLogger.warning("Tried to kill a dead server.");
				}
			}
		}
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

			if(config.emailServiceOpts && typeof config.emailServiceOpts.auth === "object"){
				this.emailServiceOpts = config.emailServiceOpts;
			}

			this.emailMsgOpts = config.emailMsgOpts;
		}
	}
}