import {TextMessage} from "../TextMessage/TextMessage";
import {HttpError} from "../Error/HttpError";
import {ECarrier} from "../TextMessage/ECarrier";
import {ISmtpOptions} from "../Error/Interfaces/ISmtpOptions";
import {EErrorType} from "../Error/Enums/EErrorType";

export class ErrorTextMessage extends TextMessage{
	public error: HttpError|Error;
	public recipientPhone: number;
	private _hasHandler: boolean;
	private _isFatal: boolean;

	public async sendError(error: HttpError|Error, source?: string){
		let subject: string;
		let srcMsg: string;

		if(!error){
			return;
		}

		this.msgOptions.text = error.message;
		this.msgOptions.subject = `${(this._isFatal) ? "Fatal" : ""}${(this._hasHandler) ? EErrorType[this.error['handler'].type] : "Unknown"} Error Received`;
		this.error = error;

		if (typeof error['isFatal'] === "boolean" || (typeof error['handler'] === "function")) {
			this._isFatal = error['isFatal'];
			this._hasHandler = !!(error['handler'].type);
		}
		if(source){
			srcMsg = `\nSource: ${source}`;
			this.msgOptions.text += srcMsg;
		}
		await this.send(this.msgOptions.subject, this.msgOptions.text, this.recipientPhone);
	}

	constructor(carrierName: ECarrier, recipientPhone: number, smtpOpts: ISmtpOptions){
		super(carrierName, smtpOpts);
		this.recipientPhone = recipientPhone;
	}
}