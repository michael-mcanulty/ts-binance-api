"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeMailer_1 = require("../Error/NodeMailer");
const HttpErrorHandler_1 = require("../Error/HttpErrorHandler");
class TextMessage {
    constructor(carrierName, smtpOpts) {
        this.msgOptions = {};
        if (!smtpOpts || !smtpOpts.auth || !smtpOpts.auth.user || !smtpOpts.auth.pass) {
            throw new Error("Creating a new TextMessage requires email options with a username and password.");
        }
        this.msgOptions.from = smtpOpts.auth.user;
        this.smtpOptions = smtpOpts;
        this.carrier = carrierName;
        let matchedCarrier = TextMessage.USCarriers.filter(d => {
            return (d.name === carrierName);
        });
        if (matchedCarrier && matchedCarrier.length > 0) {
            let match = matchedCarrier[0];
            this.domain = match.domain;
            this.carrier = match.name;
        }
        else {
            throw new Error(`${carrierName} not found`);
        }
        TextMessage.mailService = new NodeMailer_1.NodeMailer();
    }
    _getCarrierEmailAddress(phoneNumber) {
        return `${phoneNumber}@${this.domain}`;
    }
    async send(subject, message, recipientPhone) {
        let sentEmail;
        try {
            this.msgOptions.to = this._getCarrierEmailAddress(recipientPhone);
            this.msgOptions.subject = message;
            this.msgOptions.text = message;
            sentEmail = await HttpErrorHandler_1.HttpErrorHandler.mailService.sendEmail(this.msgOptions, this.smtpOptions);
            return sentEmail;
        }
        catch (err) {
            throw err;
        }
    }
    async sendError(error, recipientPhone, source) {
        let subject;
        let srcMsg;
        let isFatal;
        let hasHandler;
        if (!error) {
            return;
        }
        this.msgOptions.text = error.message;
        this.msgOptions.subject = `${(isFatal) ? "Fatal" : ""}${(hasHandler) ? error['handler'].type : "Unknown"} Error Received`;
        if (typeof error['isFatal'] === "boolean" || (typeof error['handler'] === "function")) {
            isFatal = error['isFatal'];
            hasHandler = !!(error['handler'].type);
        }
        if (source) {
            srcMsg = `\nSource: ${source}`;
            this.msgOptions.text += srcMsg;
        }
        await this.send(this.msgOptions.subject, this.msgOptions.text, recipientPhone);
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