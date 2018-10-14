import {ICarrier} from "./ICarrier";
import {NodeMailer} from "../Error/NodeMailer";
import {HttpErrorHandler} from "../Error/HttpErrorHandler";
import {IMessageOptions} from "../Error/Interfaces/IMessageOptions";
import {ISmtpOptions} from "../Error/Interfaces/ISmtpOptions";
import {TCarrier} from "./TCarrier";
import {ECarrier} from "../TextMessage/ECarrier";

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
			sentEmail = await HttpErrorHandler.mailService.sendEmail(this.msgOptions, this.smtpOptions);
			return sentEmail;
		} catch (err) {
			throw err;
		}
	}

	constructor(carrierName: ECarrier, smtpOpts: ISmtpOptions) {
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
		TextMessage.mailService = new NodeMailer();
	}
}