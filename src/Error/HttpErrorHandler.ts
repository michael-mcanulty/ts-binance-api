import {EMethod} from "../Rest/EMethod";
import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./NodeMailer";
import {IMessageOptions} from "./Interfaces/IMessageOptions";
import {BBLogger} from "../Logger/BBLogger";
import {EErrorType} from "./Enums/EErrorType";
import {HttpError} from "./HttpError";
import {ISmtpOptions} from "./Interfaces/ISmtpOptions";
import {URL} from "url";
import {IHttpErrorHandler} from "./Interfaces/IHttpErrorHandler";
import {IHttpError} from "./Interfaces/IHttpError";

export class HttpErrorHandler {
	public static mailService: NodeMailer;
	public static emailMsgOptions: IMessageOptions;
	public static emailServiceOptions: ISmtpOptions;
	type: string;
	sendEmail: boolean;
	emailMsgOpts?: IMessageOptions;
	emailServiceOpts?: ISmtpOptions;
	endpoint?: string[]|string;
	method?: string;
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
					if (err.handler.emailMsgOpts) {
						err.handler.emailMsgOpts = HttpErrorHandler.emailMsgOptions;
						this.payload = {error: err};
					}

					if (!err.handler.emailServiceOpts || !err.handler.emailServiceOpts.auth) {
						err.handler.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
					}
					let opts: IHttpError = <IHttpError>{};
					opts.code = err.code;
					opts.message = err.message;

					let remoteEndpoints: string[] = [];
					let _endpoint: string[];

					if ((err.handler.method != undefined && err.handler.method !== null) && err.handler.endpoint) {
						_endpoint = (Array.isArray(err.handler.endpoint)) ? <string[]>err.handler.endpoint : <string[]>new Array(err.handler.endpoint);
						remoteEndpoints = _endpoint;
						if (origin && _endpoint.length > 1) {
							remoteEndpoints = _endpoint.filter(e => new URL(e).origin !== origin);
						}
					}

					let reqOpts: RequestInit = <RequestInit>{};
					reqOpts.method = err.handler.method;
					reqOpts.headers = new Headers();
					reqOpts.headers.set("Content-Type", "application/json");
					reqOpts.body = this.payload || null;

					//Send an email
					if (err.handler.sendEmail && err.handler.emailMsgOpts && (err.handler.emailServiceOpts || HttpErrorHandler.emailServiceOptions)) {
						HttpErrorHandler.mailService = new NodeMailer();
						err.handler.emailMsgOpts.subject = (!err.handler.emailMsgOpts.subject || err.handler.emailMsgOpts.subject.length === 0) ? `${opts.message} ${err.handler.type || "Unknown"} Error Received` : err.handler.emailMsgOpts.subject;
						err.handler.emailMsgOpts.text = (!err.handler.emailMsgOpts.text || err.handler.emailMsgOpts.text.length === 0) ? `Error code: ${opts.code} \n Message: ${opts.message}` : err.handler.emailMsgOpts.text;
						let defaultServiceOpts: ISmtpOptions = HttpErrorHandler.emailServiceOptions;

						await HttpErrorHandler.mailService.sendEmail(err.handler.emailMsgOpts, err.handler.emailServiceOpts || defaultServiceOpts);

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

	constructor(config: IHttpErrorHandler) {
		this.emailServiceOpts	= HttpErrorHandler.emailServiceOptions;
		this.emailMsgOpts	= (HttpErrorHandler.emailMsgOptions)? HttpErrorHandler.emailMsgOptions: <IMessageOptions>{};

		if(config){
			if(config.endpoint){
				this.endpoint = (Array.isArray(config.endpoint))?<string[]>config.endpoint:<string[]>new Array(config.endpoint);
			}
			this.method =  EMethod[config.method];
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