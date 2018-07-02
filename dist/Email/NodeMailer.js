"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const ServiceOptions_1 = require("./ServiceOptions");
const nodeMailer = require("nodemailer");

class NodeMailer {
	constructor(serviceOptions) {
		this.api = nodeMailer;
		this.serviceOpts = new ServiceOptions_1.ServiceOptions(serviceOptions);
	}

	sendEmail(msgOpts) {
		return new Promise((resolve, reject) => {
			this.msgOpts = msgOpts;
			this.api.createTransport(this.serviceOpts).sendMail(this.msgOpts, (error, info) => {
				if (error) {
					reject(error);
				}
				else {
					resolve('Email sent: ' + info.response);
				}
			});
		});
	}
}

exports.NodeMailer = NodeMailer;
//# sourceMappingURL=NodeMailer.js.map