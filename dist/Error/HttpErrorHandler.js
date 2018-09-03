"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EMethod_1 = require("../Rest/EMethod");
const BotHttp_1 = require("../Rest/BotHttp");
const NodeMailer_1 = require("./Email/NodeMailer");
const ServiceOptions_1 = require("./Email/ServiceOptions");
const BBLogger_1 = require("../Logger/BBLogger");
const EErrorType_1 = require("../../dist/Error/Email/Enums/EErrorType");
class HttpErrorHandler {
    handleException(code, message, method, endpoint, workerId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (method != undefined && endpoint) {
                this.method = EMethod_1.EMethod[method];
                this.endpoint = (Array.isArray(endpoint)) ? endpoint : [endpoint];
                let reqOpts = {};
                let url;
                reqOpts.method = this.method;
                reqOpts.headers = { "Content-Type": "application/json" };
                reqOpts.body = null;
                if (this.payload || (this.killWorkerOnError && workerId)) {
                    reqOpts.body = (this.payload) ? JSON.stringify(this.payload) : JSON.stringify({ "workerId": workerId });
                }
                for (let endpoint of this.endpoint) {
                    try {
                        let fetch = {};
                        fetch = yield BotHttp_1.BotHttp.fetch(endpoint, reqOpts);
                    }
                    catch (err) {
                        BBLogger_1.BBLogger.error(err);
                        reject(err);
                    }
                }
            }
            if (this.sendEmail && this.emailMsgOpts && this.emailServiceOpts) {
                HttpErrorHandler.mailService = new NodeMailer_1.NodeMailer();
                this.emailMsgOpts.subject = (!this.emailMsgOpts.subject || this.emailMsgOpts.subject.length === 0) ? `A new ${EErrorType_1.EErrorType[this.type] || "Unknown"} error has been received | ${message}` : this.emailMsgOpts.subject;
                this.emailMsgOpts.text = (!this.emailMsgOpts.text || this.emailMsgOpts.text.length === 0) ? `${new Date().toLocaleDateString()} : \n Code: ${code} \n Message: ${message}` : this.emailMsgOpts.text;
                try {
                    yield HttpErrorHandler.mailService.sendEmail(this.emailMsgOpts, this.emailServiceOpts);
                }
                catch (err) {
                    BBLogger_1.BBLogger.error(err);
                    reject(err);
                }
            }
            resolve();
        }));
    }
    constructor(type, sendEmail, endpoint, emailServiceOpts, emailMsgOpts) {
        let msgOpts = {};
        msgOpts.to = HttpErrorHandler.defaultErrMsgRecipient;
        this.type = EErrorType_1.EErrorType[type];
        this.sendEmail = sendEmail || false;
        this.endpoint = endpoint;
        this.emailServiceOpts = new ServiceOptions_1.ServiceOptions(emailServiceOpts) || HttpErrorHandler.defaultEmailServiceOpts;
        this.emailMsgOpts = emailMsgOpts || msgOpts;
    }
}
exports.HttpErrorHandler = HttpErrorHandler;
//# sourceMappingURL=HttpErrorHandler.js.map