import {BotHttp} from "../Rest/BotHttp";
import {NodeMailer} from "./NodeMailer";
import {IMessageOptions} from "./Interfaces/IMessageOptions";
import {BBLogger} from "../Logger/BBLogger";
import {HttpError} from "./HttpError";
import {ISmtpOptions} from "./Interfaces/ISmtpOptions";
import {URL} from "url";
import {IHttpErrorHandler} from "./Interfaces/IHttpErrorHandler";
import {IHttpError} from "./Interfaces/IHttpError";
import {worker} from "cluster";
import {ITextMsgOptions} from "../TextMessage/ITextMsgOptions";
import {OptionsWithUri} from "request";
import {ECarrier} from "../TextMessage/ECarrier";
import {TextMessage} from "../TextMessage/TextMessage";
import {TMethod} from "../Rest/TMethod";

export class HttpErrorHandler {
	public static emailMsgOptions: IMessageOptions;
	emailMsgOpts?: IMessageOptions;
	public static emailServiceOptions: ISmtpOptions;
	emailServiceOpts?: ISmtpOptions;
	endpoint?: string[] | string;
	public static mailService: NodeMailer;
	method?: TMethod;
	payload?: any;
	restartSingleWorker: boolean = false;
	sendEmail: boolean;
	sendText: boolean;
	public static textMsgOptions: ITextMsgOptions;
	textMsgOpts?: ITextMsgOptions;
	type: string;

	async execute(err: HttpError, srcUrl: URL): Promise<any> {
		let reqOpts: OptionsWithUri;
		try {
			//"http://localhost:3001"
			let origin = srcUrl.origin;

			let srcServer: string = (srcUrl.port.charAt(-1) == "1") ? "Data Server" : "Analysis Server";

			if (err && HttpErrorHandler.hasHandler(err)) {

				if (this.restartSingleWorker) {
					this.payload.id = worker.id;
				}

				if (err.handler.emailMsgOpts) {
					err.handler.emailMsgOpts = HttpErrorHandler.emailMsgOptions;
				}

				if (!err.handler.emailServiceOpts || !err.handler.emailServiceOpts.auth) {
					err.handler.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
				}

				let _error: IHttpError = HttpError.toObjLiteral(err);

				let remoteEndpoints: string[] = [];
				let _endpoint: string[];

				if (err.handler.method && err.handler.endpoint) {
					this.payload = {error: _error};
					_endpoint = (Array.isArray(err.handler.endpoint)) ? <string[]>err.handler.endpoint: <string[]>new Array(err.handler.endpoint);
					remoteEndpoints = _endpoint;
					if (origin && _endpoint.length > 1) {
						remoteEndpoints = _endpoint.filter(e => new URL(e).origin !== origin);
					}
				}

				reqOpts = <OptionsWithUri>{};
				reqOpts.method = err.handler.method;
				reqOpts.json = true;

				if (this.payload) {
					reqOpts.body = this.payload;
				}

				//Send an email
				if (err.handler.sendEmail && err.handler.emailMsgOpts && (err.handler.emailServiceOpts || HttpErrorHandler.emailServiceOptions)) {
					err.handler.emailMsgOpts.subject = (!err.handler.emailMsgOpts.subject || err.handler.emailMsgOpts.subject.length === 0) ? `${_error.message} ${err.handler.type || "Unknown"} Error on the ${srcServer}` : err.handler.emailMsgOpts.subject;
					err.handler.emailMsgOpts.text = (!err.handler.emailMsgOpts.text || err.handler.emailMsgOpts.text.length === 0) ? `Error code: ${_error.code} \n Message: ${_error.message} \n Stack: ${err.stack}` : err.handler.emailMsgOpts.text;
					let defaultServiceOpts: ISmtpOptions = HttpErrorHandler.emailServiceOptions;

					await HttpErrorHandler.mailService.sendEmail(err.handler.emailMsgOpts, err.handler.emailServiceOpts || defaultServiceOpts);
				}

				//Send text message
				if (err.handler.sendText && (err.handler.textMsgOpts || HttpErrorHandler.textMsgOptions)) {
					let textMsg = new TextMessage(ECarrier.TMobile, err.handler.emailServiceOpts);
					await textMsg.sendError(err, err.handler.textMsgOpts.recipientPhone, origin);
				}

				//Kamikaze style. Destroy endpoints with suicide on last post.
				for (let ePoint of remoteEndpoints) {
					reqOpts.uri = ePoint;
					await BotHttp.requestApi(reqOpts);
				}

				//Suicidal final post.
				if ((_endpoint && remoteEndpoints && origin ) && (_endpoint.length > remoteEndpoints.length)) {
					let lastPoint: string[] = _endpoint.filter(e => new URL(e).origin === origin);
					if (lastPoint && lastPoint.length > 0) {
						reqOpts.uri = lastPoint[0];
						await BotHttp.requestApi(reqOpts);
					}
				}

			}

		} catch (err) {
			BBLogger.error(err);
			throw err;
		}
	}

	public static hasHandler(err: HttpError) {
		return (err && HttpError.isHttpError(err) && err.handler instanceof HttpErrorHandler);
	}

	constructor(handler: IHttpErrorHandler) {
		this.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
		this.emailMsgOpts = (HttpErrorHandler.emailMsgOptions) ? HttpErrorHandler.emailMsgOptions : <IMessageOptions>{};
		this.textMsgOpts = (HttpErrorHandler.textMsgOptions) ? HttpErrorHandler.textMsgOptions : <ITextMsgOptions>{};
		if (handler) {
			if (handler.endpoint) {
				this.endpoint = (Array.isArray(handler.endpoint)) ? <string[]>handler.endpoint : <string[]>new Array(handler.endpoint);
			}
			this.method = handler.method;
			this.type = handler.type || 'Binance';
			this.sendEmail = handler.sendEmail;
			this.sendText = handler.sendText;
			this.payload = handler.payload;

			if (handler.emailServiceOpts && typeof handler.emailServiceOpts.auth === "object") {
				this.emailServiceOpts = handler.emailServiceOpts;
			}
			this.textMsgOpts = handler.textMsgOpts;
			this.emailMsgOpts = handler.emailMsgOpts;
		}
		HttpErrorHandler.mailService = new NodeMailer();
	}
}