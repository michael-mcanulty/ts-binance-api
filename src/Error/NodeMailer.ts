import * as nodeMailer from "nodemailer";
import {IMessageOptions} from "./Interfaces/IMessageOptions";
import {NodeMailerService} from "./Types/Types";
import {ISmtpOptions} from "./Interfaces/ISmtpOptions";

export class NodeMailer {
	public static Service: NodeMailerService = nodeMailer;

	public sendEmail(msgOpts: IMessageOptions, serviceOptions: ISmtpOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!serviceOptions || !msgOpts) {
				reject("Service Options must be provided");
			} else {
				NodeMailer.Service.createTransport(serviceOptions).sendMail(msgOpts, (error, info: { response: string }) => {
					if (error) {
						reject(error);
					} else {
						resolve(`Email Sent: ${info.response}`);
					}
				});
			}
		});
	}

	constructor() {}
}
