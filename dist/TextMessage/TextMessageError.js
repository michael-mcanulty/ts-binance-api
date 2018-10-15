"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextMessage_1 = require("../TextMessage/TextMessage");
class TextMessageError extends TextMessage_1.TextMessage {
    async sendError(error, source) {
        let subject;
        let srcMsg;
        if (!error) {
            return;
        }
        this.msgOptions.text = error.message;
        this.msgOptions.subject = `${(this._isFatal) ? "Fatal" : ""}${(this._hasHandler) ? this.error['handler'].type : "Unknown"} Error Received`;
        this.error = error;
        if (typeof error['isFatal'] === "boolean" || (typeof error['handler'] === "function")) {
            this._isFatal = error['isFatal'];
            this._hasHandler = !!(error['handler'].type);
        }
        if (source) {
            srcMsg = `\nSource: ${source}`;
            this.msgOptions.text += srcMsg;
        }
        await this.send(this.msgOptions.subject, this.msgOptions.text, this.recipientPhone);
    }
    constructor(carrierName, recipientPhone, smtpOpts) {
        super(carrierName, smtpOpts);
        this.recipientPhone = recipientPhone;
    }
}
exports.TextMessageError = TextMessageError;
//# sourceMappingURL=TextMessageError.js.map