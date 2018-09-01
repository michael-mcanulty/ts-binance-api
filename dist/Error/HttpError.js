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
const EErrorType_1 = require("./Email/Enums/EErrorType");
const EMethod_1 = require("../Rest/EMethod");
const BotHttp_1 = require("../Rest/BotHttp");
const NodeMailer_1 = require("./Email/NodeMailer");
const __1 = require("..");
const EServiceProviders_1 = require("./Email/Enums/EServiceProviders");
class HttpErrorHandler {
    get url() {
        return `${this.endpoint}:${this.port}`;
    }
    handleError(code, message) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.port && this.method) {
                let url = this.url;
                let reqOpts = {};
                reqOpts.method = EMethod_1.EMethod[this.method];
                reqOpts.headers = new Headers();
                if (this.payload && this.payload.length > 0) {
                    url = BotHttp_1.BotHttp.buildUrl(this._url, false, this.payload);
                }
                try {
                    let fetch = {};
                    fetch = yield BotHttp_1.BotHttp.fetch(url, reqOpts);
                }
                catch (err) {
                    __1.BBLogger.error(err);
                    reject(err);
                }
            }
            if (this.sendEmail && this.emailMsgOpts && this.emailServiceOpts) {
                HttpErrorHandler._nodeMailerService = new NodeMailer_1.NodeMailer();
                this.emailMsgOpts.subject = (!this.emailMsgOpts.subject || this.emailMsgOpts.subject.length === 0) ? `A new ${EErrorType_1.EErrorType[this.type] || "Unknown"} error has been received | ${message}` : this.emailMsgOpts.subject;
                this.emailMsgOpts.text = (!this.emailMsgOpts.text || this.emailMsgOpts.text.length === 0) ? `${new Date().toLocaleDateString()} : \n Code: ${code} \n Message: ${message}` : this.emailMsgOpts.text;
                try {
                    yield HttpErrorHandler._nodeMailerService.sendEmail(this.emailMsgOpts, this.emailServiceOpts);
                }
                catch (err) {
                    __1.BBLogger.error(err);
                    reject(err);
                }
            }
            resolve();
        }));
    }
    constructor(type, method, port, sendEmail, endpoint, emailMsgOpts, emailServiceOpts) {
        let msgOpts = {};
        msgOpts.to = HttpErrorHandler.defaultErrMsgRecipient;
        this.type = EErrorType_1.EErrorType[type];
        this.method = EMethod_1.EMethod[method];
        this.port = port;
        this.sendEmail = sendEmail || false;
        this.endpoint = endpoint;
        this.emailServiceOpts = emailServiceOpts || HttpErrorHandler.defaultEmailServiceOpts;
        this.emailMsgOpts = emailMsgOpts || msgOpts;
        if (this.endpoint && this.port) {
            this._url = `${this.endpoint}:${this.port}`;
        }
        else {
            this._url = null;
        }
    }
}
exports.HttpErrorHandler = HttpErrorHandler;
class HttpError extends Error {
    constructor(code, message, handler) {
        super();
        this.code = code;
        this.message = message;
        if (handler) {
            this.handler = handler;
        }
        else {
            let errHandler = HttpError._getErrorHandler(this);
            if (errHandler !== null) {
                this.handler = errHandler;
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield this.handler.handleError(code, message);
                }))();
            }
        }
    }
    static getErrorByCode(code) {
        let result;
        if (HttpError.allErrors.length > 0) {
            let filtered = HttpError.allErrors.filter(handler => handler.code === code);
            if (filtered && filtered.length > 0) {
                result = filtered[0];
            }
        }
        return result;
    }
    static _getErrorHandler(error) {
        let match = HttpError.allErrors.filter(err => err.code === error.code);
        if (Array.isArray(match) && typeof match[0].handler === "object") {
            return match[0].handler;
        }
        else {
            return null;
        }
    }
    static _getErrorParameters(err) {
        let code = parseInt(err.code.toString());
        let type = HttpError._getErrorType(err);
        let message = (type === EErrorType_1.EErrorType.Binance) ? err['msg'] : err['message'];
        return { code: code, message: message };
    }
    static _getErrorType(err) {
        let code = parseInt(err.code.toString());
        let isBinance = false;
        if (typeof err['msg'] === "string" && code < 0) {
            isBinance = true;
        }
        else if (typeof err['message'] === "string") {
            isBinance = false;
        }
        return (isBinance) ? EErrorType_1.EErrorType.Binance : EErrorType_1.EErrorType.Node;
    }
    static GetTimeoutFromIPBannedMsg(err) {
        let strFloat;
        let result = 0;
        if (err && err.msg) {
            let msg = "IP banned until ";
            let startIdx = err.msg.indexOf(msg) + msg.length;
            let float = parseFloat(err.msg.slice(startIdx, startIdx + 13));
            strFloat = float.toString();
            if (strFloat.length === 13) {
                result = float - new Date().getTime();
            }
        }
        return result;
    }
    static fromError(err) {
        let code = parseInt(err.code.toString());
        let type = HttpError._getErrorType(err);
        let message = (type === EErrorType_1.EErrorType.Binance) ? err['msg'] : err['message'];
        let _httpError = new HttpError(code, message);
        if (type === EErrorType_1.EErrorType.Binance && typeof err['handler'] === "object") {
            _httpError.handler = err['handler'];
        }
        return _httpError;
    }
}
HttpError.allErrors = [
    new HttpError(-1000, "UNKNOWN", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1001, "DISCONNECTED", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1002, "UNAUTHORIZED", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1003, "TOO_MANY_REQUESTS", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1006, "UNEXPECTED_RESP", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1007, "TIMEOUT", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1013, "INVALID_MESSAGE", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1014, "UNKNOWN_ORDER_COMPOSITION", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1015, "TOO_MANY_ORDERS", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1016, "SERVICE_SHUTTING_DOWN", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1020, "UNSUPPORTED_OPERATION", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1021, "INVALID_TIMESTAMP", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1022, "INVALID_SIGNATURE", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1100, "ILLEGAL_CHARS", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1101, "TOO_MANY_PARAMETERS", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1102, "MANDATORY_PARAM_EMPTY_OR_MALFORMED", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1103, "UNKNOWN_PARAM", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1104, "UNREAD_PARAMETERS", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1105, "PARAM_EMPTY", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1106, "PARAM_NOT_REQUIRED", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-1130, "INVALID_PARAMETER", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-2008, "BAD_API_ID", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-2009, "DUPLICATE_API_KEY_DESC", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-2010, "INSUFFICIENT_BALANCE", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-2012, "CANCEL_ALL_FAIL", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-2013, "NO_SUCH_ORDER", new HttpErrorHandler(EErrorType_1.EErrorType.Binance)),
    new HttpError(-2014, "BAD_API_KEY_FMT", new HttpErrorHandler(EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, 3001, true, "http://localhost", { to: "michael.mcanulty88@gmail.com" }, { service: EServiceProviders_1.EServiceProviders.Gmail })),
    new HttpError(-2015, "REJECTED_MBX_KEY", new HttpErrorHandler(EErrorType_1.EErrorType.Binance))
];
exports.HttpError = HttpError;
//# sourceMappingURL=HttpError.js.map