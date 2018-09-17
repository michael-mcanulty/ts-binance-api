"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeMailer = require("Error/NodeMailer");
class NodeMailer {
    constructor() { }
    sendEmail(msgOpts, serviceOptions) {
        return new Promise((resolve, reject) => {
            if (!serviceOptions || !msgOpts) {
                reject("Service Options must be provided");
            }
            else {
                NodeMailer.Service.createTransport(serviceOptions).sendMail(msgOpts, (error, info) => {
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