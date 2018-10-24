import {ICarrier} from "./ICarrier";
import {NodeMailer} from "../Error/NodeMailer";
import {IMessageOptions} from "../Error/Interfaces/IMessageOptions";
import {ISmtpOptions} from "../Error/Interfaces/ISmtpOptions";
import {TCarrier} from "./TCarrier";

export class TextMessage {
	public static USCarriers: ICarrier[] = [
		{
			"name": <TCarrier> "att",
			"domain": "txt.att.net"
		},
		{
			"name": <TCarrier> "tmobile",
			"domain": "tmomail.net"
		},
		{
			"name": <TCarrier> "verizon",
			"domain": "vtext.com"
		},
		{
			"name": <TCarrier> "cricket",
			"domain": "sms.mycricket.com"
		},
		{
			"name": <TCarrier> "uscellular",
			"domain": "email.uscc.net"
		},
		{
			"name": <TCarrier> "virginmobile",
			"domain": "vmobl.com"
		},
		{
			"name": <TCarrier> "boostmobile",
			"domain": "myboostmobile.com"
		},
		{
			"name": <TCarrier> "metropcs",
			"domain": "mymetropcs.com"
		}
	];
	carrier: TCarrier;
	domain: string;
	private _mailService: NodeMailer;
	msgOptions: IMessageOptions;
	smtpOptions: ISmtpOptions;

	private _getCarrierEmailAddress(phoneNumber?: number): string {
		return `${phoneNumber}@${this.domain}`;
	}

	public async send(subject: string, message: string, recipientPhone: number): Promise<void> {
		let sentEmail: any;
		try {
			this.msgOptions.to = this._getCarrierEmailAddress(recipientPhone);
			this.msgOptions.subject = message;
			this.msgOptions.text = message;
			sentEmail = await this._mailService.sendEmail(this.msgOptions);
			return sentEmail;
		} catch (err) {
			throw err;
		}
	}

	public async sendError(error: Error, recipientPhone: number, source?: string){
		let subject: string;
		let srcMsg: string;
		let isFatal: boolean;
		let hasHandler: boolean;

		if(!error){
			return;
		}

		this.msgOptions.text = error.message;
		this.msgOptions.subject = `${(isFatal) ? "Fatal" : ""}${(hasHandler) ? error['handler'].type : "Unknown"} Error Received`;

		if (typeof error['isFatal'] === "boolean" || (typeof error['handler'] === "function")) {
			isFatal = error['isFatal'];
			hasHandler = !!(error['handler'].type);
		}
		if(source){
			srcMsg = `\nSource: ${source}`;
			this.msgOptions.text += srcMsg;
		}
		await this.send(this.msgOptions.subject, this.msgOptions.text, recipientPhone);
	}

	constructor(carrierName: TCarrier, smtpOpts: ISmtpOptions) {
		this.msgOptions = <IMessageOptions>{};
		if(!smtpOpts || !smtpOpts.auth || !smtpOpts.auth.user || !smtpOpts.auth.pass){
			throw new Error("Creating a new TextMessage requires email options with a username and password.");
		}
		this.msgOptions.from = smtpOpts.auth.user;
		this.smtpOptions = smtpOpts;
		this.carrier = carrierName;
		let matchedCarrier: ICarrier[] = TextMessage.USCarriers.filter(d => {
			return (d.name === carrierName);
		});
		if (matchedCarrier && matchedCarrier.length > 0) {
			let match: ICarrier = matchedCarrier[0];
			this.domain = match.domain;
			this.carrier = match.name;
		} else {
			throw new Error(`${carrierName} not found`);
		}
		this._mailService = new NodeMailer(this.smtpOptions);
	}
}