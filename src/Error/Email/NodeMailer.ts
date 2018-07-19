import {IEmailOptions} from "./Interfaces/IServiceOprtions";
import {ServiceOptions} from "./ServiceOptions";
import * as nodeMailer from "nodemailer";
import {IMessageOptions} from "./Interfaces/IMessageOptions";
import {NodeMailerService} from "./Types/Types";

export class NodeMailer {
	public static Options: ServiceOptions;
	public static Service: NodeMailerService = nodeMailer;
	private _msgOpts: IMessageOptions;

	public sendEmail(msgOpts: IMessageOptions, serviceOptions?: ServiceOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			this._msgOpts = msgOpts;
			if (!serviceOptions || !NodeMailer.Options) {
				reject("Service Options must be provided");
			} else {
				NodeMailer.Service.createTransport(serviceOptions || NodeMailer.Options).sendMail(this._msgOpts, (error, info: { response: string }) => {
					if (error) {
						reject(error);
					} else {
						resolve(`Email Sen: ${info.response}`);
					}
				});
			}
		});
	}

	constructor(serviceOptions: IEmailOptions) {
		NodeMailer.Options = new ServiceOptions(serviceOptions);
	}
}
