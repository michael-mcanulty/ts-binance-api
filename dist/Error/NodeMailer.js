"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeMailer = require("nodemailer");
class NodeMailer {
    constructor() {
    }
    async sendEmail(msgOpts, serviceOptions) {
        if (!serviceOptions || !msgOpts) {
            return Promise.reject(new Error("Service Options must be provided"));
        }
        else {
            NodeMailer.Service.createTransport(serviceOptions).sendMail(msgOpts, (error, info) => {
                if (error) {
                    return Promise.reject(error);
                }
                else {
                    return `Email Sent: ${info.response}`;
                }
            });
        }
    }
}
NodeMailer.Service = nodeMailer;
exports.NodeMailer = NodeMailer;
//# sourceMappingURL=NodeMailer.js.map