"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeMailer = require("nodemailer");
class NodeMailer {
    sendEmail(msgOpts) {
        return new Promise((resolve, reject) => {
            if (!msgOpts) {
                reject(new Error("Service Options must be provided"));
            }
            this.service.sendMail(msgOpts, (error, info) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(info.response);
                }
            });
        });
    }
    constructor(serviceOptions) {
        this.service = nodeMailer.createTransport(serviceOptions);
    }
}
exports.NodeMailer = NodeMailer;
//# sourceMappingURL=NodeMailer.js.map