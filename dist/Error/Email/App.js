"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const ServiceOptions_1 = require("./ServiceOptions");
const nodeMailer = require("nodemailer");
class NodeMailer {
	constructor(serviceOptions) {
		NodeMailer.ServiceConfig = new ServiceOptions_1.ServiceOptions(serviceOptions);
	}

	sendEmail(msgOpts, serviceOptions) {
		return new Promise((resolve, reject) => {
			this.msgOpts = msgOpts;
			if (!serviceOptions || !NodeMailer.ServiceConfig) {
				reject("Service Options must be provided");
			}
			else {
				NodeMailer.App.createTransport(serviceOptions || NodeMailer.ServiceConfig).sendMail(this.msgOpts, (error, info) => {
					if (error) {
						reject(error);
					}
					else {
						resolve(`Email Sen: ${info.response}`);
					}
				});
			}
		});
	}
}
NodeMailer.App = nodeMailer;
exports.NodeMailer = NodeMailer;
//# sourceMappingURL=App.js.map