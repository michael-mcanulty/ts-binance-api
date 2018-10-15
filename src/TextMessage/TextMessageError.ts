import {TextMessage} from "../TextMessage/TextMessage";
import {ECarrier, ISmtpOptions} from "..";

export class TextMessageError extends TextMessage{
	public error: Error;
	public recipientPhone: number;
	private _hasHandler: boolean;
	private _isFatal: boolean;

	public async sendError(error: Error, source?: string){
		let subject: string;
		let srcMsg: string;

		if(!error){
			return;
		}

		this.msgOptions.text = error.message;
		this.msgOptions.subject = `${(this._isFatal) ? "Fatal" : ""}${(this._hasHandler) ? this.error['handler'].type : "Unknown"} Error Received`;
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