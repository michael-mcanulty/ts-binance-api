"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeMailer_1 = require("../Error/NodeMailer");
const HttpErrorHandler_1 = require("../Error/HttpErrorHandler");
const EErrorType_1 = require("../Error/Enums/EErrorType");
const __1 = require("..");
class TextMessage {
    constructor(carrierName, msgOptions, smtpOptions) {
        this.smtpOptions = smtpOptions || __1.Binance.options.emailServiceOpts;
        this.msgOptions = msgOptions || __1.Binance.options.emailMsgOpts;
        let carrier = (carrierName) ? carrierName.toLowerCase() : TextMessage.options.carrier;
        let matchedCarrier = TextMessage.USCarriers.filter(d => {
            return (d.name === carrier);
        });
        if (matchedCarrier.length > 0 && carrier) {
            let match = matchedCarrier[0];
            this.domain = match.domain;
            this.carrier = match.name;
        }
        else {
            throw new Error(`${carrierName} not found`);
        }
        TextMessage.mailService = new NodeMailer_1.NodeMailer();
    }
    getEmailAddress(phoneNumber) {
        return `${phoneNumber}@${this.domain}`;
    }
    send(error, srcUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                let isKnownErr = false;
                let isFatal = false;
                let msg;
                if (typeof TextMessage.options !== "object") {
                    return reject(new Error("Static Options are missing from TextMessage class"));
                }
                msg = error.message;
                if (typeof error['isFatal'] === "boolean" || (typeof error['handler'] === "function")) {
                    isFatal = error['isFatal'];
                    isKnownErr = !!(error['handler'].type);
                }
                if (!TextMessage.options.to) {
                    return reject(new Error("A recipient's phone number is required to send a text message."));
                }
                this.msgOptions.to = this.getEmailAddress(TextMessage.options.to);
                this.msgOptions.subject = `${(isFatal) ? "Fatal" : ""}${(isKnownErr) ? EErrorType_1.EErrorType[error['handler'].type] : "Unknown"} Error Received`;
                this.msgOptions.text = `${msg}. \nServer: ${srcUrl}`;
                await HttpErrorHandler_1.HttpErrorHandler.mailService.sendEmail(this.msgOptions, this.smtpOptions);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
TextMessage.USCarriers = [
    {
        "name": "att",
        "domain": "txt.att.net"
    },
    {
        "name": "tmobile",
        "domain": "tmomail.net"
    },
    {
        "name": "verizon",
        "domain": "vtext.com"
    },
    {
        "name": "cricket",
        "domain": "sms.mycricket.com"
    },
    {
        "name": "uscellular",
        "domain": "email.uscc.net"
    },
    {
        "name": "virginmobile",
        "domain": "vmobl.com"
    },
    {
        "name": "boostmobile",
        "domain": "myboostmobile.com"
    },
    {
        "name": "metropcs",
        "domain": "mymetropcs.com"
    }
];
exports.TextMessage = TextMessage;
//# sourceMappingURL=TextMessage.js.map