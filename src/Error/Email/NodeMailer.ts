import {ServiceOptions} from "./ServiceOptions";
import * as nodeMailer from "nodemailer";
import {IMessageOptions} from "./Interfaces/IMessageOptions";
import {NodeMailerService} from "./Types/Types";

export class NodeMailer {
	public static Service: NodeMailerService = nodeMailer;

	public sendEmail(msgOpts: IMessageOptions, serviceOptions: ServiceOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!serviceOptions || !msgOpts) {
				reject("Service Options must be provided");
			} else {
				NodeMailer.Service.createTransport(serviceOptions).sendMail(msgOpts, (error, info: { response: string }) => {
					if (error) {
						reject(error);
					} else {
						resolve(`Email Sen: ${info.response}`);
					}
				});
			}
		});
	}

	constructor() {}
}
