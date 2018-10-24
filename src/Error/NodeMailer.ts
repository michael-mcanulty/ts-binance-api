import * as nodeMailer from "nodemailer";
import {IMessageOptions} from "./Interfaces/IMessageOptions";
import {NodeMailerService} from "./Types/Types";
import {ISmtpOptions} from "./Interfaces/ISmtpOptions";

export class NodeMailer {
	private _service: NodeMailerService;

	public sendEmail(msgOpts: IMessageOptions): Promise<any> {
		return new Promise((resolve, reject)=>{

			if (!msgOpts) {
				reject(new Error("Service Options must be provided"));
			}

			this._service.sendMail(msgOpts, (error, info: { response: string }) => {
				if (error) {
					reject(error);
				} else {
					resolve(info.response);
				}
			});
		})
	}

	constructor(serviceOptions: ISmtpOptions) {
		this._service = nodeMailer.createTransport(serviceOptions);
	}
}
