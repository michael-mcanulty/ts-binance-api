import {ICarrier} from "./ICarrier";
import {NodeMailer} from "../Error/NodeMailer";
import {HttpErrorHandler} from "../Error/HttpErrorHandler";
import {ITextMsgOptions} from "./ITextMsgOptions";
import {IMessageOptions} from "../Error/Interfaces/IMessageOptions";
import {EErrorType} from "../Error/Enums/EErrorType";
import {Binance} from "../Binance/Binance";
import {HttpError} from "../Error/HttpError";
import {ISmtpOptions} from "../Error/Interfaces/ISmtpOptions";
import {TCarrier} from "./TCarrier";
import {IBinanceOptions} from "..";

export class TextMessage {
	public static USCarriers: ICarrier[] = [
		{
			"name": "att",
			"domain": "txt.att.net"
		},
		{
			"name": "tmobile",
			"domain": "tmomail.net"
		},
		{
			"name": "verizon",
			"domain": "vtext.com"
		},
		{
			"name": "cricket",
			"domain": "sms.mycricket.com"
		},
		{
			"name": "uscellular",
			"domain": "email.uscc.net"
		},
		{
			"name": "virginmobile",
			"domain": "vmobl.com"
		},
		{
			"name": "boostmobile",
			"domain": "myboostmobile.com"
		},
		{
			"name": "metropcs",
			"domain": "mymetropcs.com"
		}
	];

	carrier: TCarrier;
	domain: string;
	public static mailService: NodeMailer;
	msgOptions?: IMessageOptions;
	smtpOptions?: ISmtpOptions;
	public static txtMsgOpts: ITextMsgOptions;

	public getEmailAddress(phoneNumber?: number): string {
		return `${phoneNumber}@${this.domain}`;
	}

	public async send(error: HttpError | Error, srcUrl?: string): Promise<void> {
		try {
			let isKnownErr: boolean = false;
			let isFatal: boolean = false;
			let msg: string;

			if (typeof TextMessage.txtMsgOpts !== "object") {
				return Promise.reject(new Error("Static Options are missing from TextMessage class"));
			}

			msg = error.message;

			if (typeof error['isFatal'] === "boolean" || (typeof error['handler'] === "function")) {
				isFatal = error['isFatal'];
				isKnownErr = !!(error['handler'].type);
			}
			if (!TextMessage.txtMsgOpts.phoneNum) {
				return Promise.reject(new Error("A recipient's phone number is required phoneNum send a text message."));
			}

			this.msgOptions.to = this.getEmailAddress(TextMessage.txtMsgOpts.phoneNum);
			this.msgOptions.subject = `${(isFatal) ? "Fatal" : ""}${(isKnownErr) ? EErrorType[error['handler'].type] : "Unknown"} Error Received`;
			this.msgOptions.text = `${msg}. \nServer: ${srcUrl}`;
			await HttpErrorHandler.mailService.sendEmail(this.msgOptions, this.smtpOptions);
			return;
		} catch (err) {
			throw err;
		}
	}

	constructor(carrierName?: TCarrier, binanceOpts?: IBinanceOptions) {
		this.smtpOptions = binanceOpts.emailServiceOpts;
		this.msgOptions = binanceOpts.emailMsgOpts;
		let carrier: TCarrier = (carrierName) ? <TCarrier>carrierName.toLowerCase() : <TCarrier>TextMessage.txtMsgOpts.carrier;
		let matchedCarrier: ICarrier[] = TextMessage.USCarriers.filter(d => {
			return (d.name === carrier);
		});
		if (matchedCarrier.length > 0 && carrier) {
			let match: ICarrier = matchedCarrier[0];
			this.domain = match.domain;
			this.carrier = match.name;
		} else {
			throw new Error(`${carrierName} not found`);
		}
		TextMessage.mailService = new NodeMailer();
	}
}