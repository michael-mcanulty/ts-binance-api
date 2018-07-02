import {IServiceOptions} from "./Interfaces/IServiceOprtions";
import {ServiceOptions} from "./ServiceOptions";
import * as nodeMailer from "nodemailer";
import {IMessageOptions} from "./Interfaces/IMessageOptions";
import {NodeMailerService} from "./Types/Types";

export class NodeMailer {
	public static App: NodeMailerService = nodeMailer;
	public static ServiceConfig: ServiceOptions;
	private msgOpts: IMessageOptions;

	public sendEmail(msgOpts: IMessageOptions, serviceOptions?: ServiceOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			this.msgOpts = msgOpts;
			if (!serviceOptions || !NodeMailer.ServiceConfig) {
				reject("Service Options must be provided");
			} else {
				NodeMailer.App.createTransport(serviceOptions || NodeMailer.ServiceConfig).sendMail(this.msgOpts, (error, info: { response: string }) => {
					if (error) {
						reject(error);
					} else {
						resolve(`Email Sen: ${info.response}`);
					}
				});
			}
		});
	}

	constructor(serviceOptions: IServiceOptions) {
		NodeMailer.ServiceConfig = new ServiceOptions(serviceOptions);
	}
}
