"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceOptions_1 = require("./ServiceOptions");
const nodeMailer = require("nodemailer");
class NodeMailer {
    constructor(serviceOptions) {
        NodeMailer.Options = new ServiceOptions_1.ServiceOptions(serviceOptions);
    }
    sendEmail(msgOpts, serviceOptions) {
        return new Promise((resolve, reject) => {
            this._msgOpts = msgOpts;
            if (!serviceOptions || !NodeMailer.Options) {
                reject("Service Options must be provided");
            }
            else {
                NodeMailer.Service.createTransport(serviceOptions || NodeMailer.Options).sendMail(this._msgOpts, (error, info) => {
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
NodeMailer.Service = nodeMailer;
exports.NodeMailer = NodeMailer;
//# sourceMappingURL=NodeMailer.js.map