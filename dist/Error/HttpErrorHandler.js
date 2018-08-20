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
const EErrorType_1 = require("./Email/Enums/EErrorType");
class HttpErrorHandler {
    get url() {
        return `${this.endpoint}:${this.port}`;
    }
    handleError(code, message) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.port !== null && this.method !== null) {
                let url = this._url;
                let reqOpts = {};
                reqOpts.method = EMethod_1.EMethod[this.method];
                reqOpts.headers = new Headers();
                if (this.payload && this.payload.length > 0) {
                    url = BotHttp_1.BotHttp.buildUrl(this._url, false, this.payload);
                }
                if (this.sendEmail && HttpErrorHandler.emailOptions) {
                    let msgOptions = {};
                    HttpErrorHandler._emailService = new NodeMailer_1.NodeMailer(HttpErrorHandler.emailOptions);
                    msgOptions.from = this.recipientEmail;
                    msgOptions.to = this.recipientEmail;
                    msgOptions.subject = `A new ${EErrorType_1.EErrorType[this.type] || "Unknown"} error has been received | ${message}`;
                    msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${code} \n Message: ${message}`;
                    try {
                        yield HttpErrorHandler._emailService.sendEmail(msgOptions);
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                try {
                    let fetch = {};
                    resolve(fetch);
                }
                catch (err) {
                    reject(err);
                }
            }
        }));
    }
    constructor(type, method, port, sendEmail, endpoint, recipientEmail) {
        this.type = EErrorType_1.EErrorType[type];
        this.method = EMethod_1.EMethod[method] || EMethod_1.EMethod[EMethod_1.EMethod.GET];
        this.port = port || 4001;
        this.sendEmail = sendEmail || false;
        this.endpoint = endpoint || "http://localhost";
        this.recipientEmail = recipientEmail;
        if (this.endpoint && this.port) {
            this._url = `${this.endpoint}:${this.port}`;
        }
        else {
            this._url = null;
        }
    }
}
exports.HttpErrorHandler = HttpErrorHandler;
//# sourceMappingURL=HttpErrorHandler.js.map