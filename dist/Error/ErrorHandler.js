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
class ErrorHandler {
    constructor(code, message, method, type, port, sendEmail, endpoint, recipientEmail) {
        this.method = EMethod_1.EMethod[method];
        this.type = EErrorType_1.EErrorType[type];
        this.port = port;
        this.sendEmail = sendEmail || false;
        this.endpoint = endpoint;
        this.recipientEmail = recipientEmail;
        if (this.endpoint && this.port) {
            this.url = `${this.endpoint}:${this.port}`;
        }
        else {
            this.url = null;
        }
    }
    handleError(code, message) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.port !== null && this.method !== null) {
                let url = this.url;
                let reqOpts = {};
                reqOpts.method = EMethod_1.EMethod[this.method];
                reqOpts.headers = new Headers();
                if (this.payload && this.payload.length > 0) {
                    url = BotHttp_1.BotHttp.buildUrl(this.url, false, this.payload);
                }
                if (this.sendEmail && ErrorHandler.emailOptions) {
                    ErrorHandler._emailService = new NodeMailer_1.NodeMailer(ErrorHandler.emailOptions);
                    let msgOptions = {};
                    msgOptions.from = this.recipientEmail;
                    msgOptions.to = this.recipientEmail;
                    msgOptions.subject = `A new ${EErrorType_1.EErrorType[this.type] || "Unknown"} error has been received | ${message}`;
                    msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${code} \n Message: ${message}`;
                    try {
                        yield ErrorHandler._emailService.sendEmail(msgOptions);
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
}
ErrorHandler.allErrors = [
    new ErrorHandler(-1000, "UNKNOWN", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1001, "DISCONNECTED", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1002, "UNAUTHORIZED", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1003, "TOO_MANY_REQUESTS", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1006, "UNEXPECTED_RESP", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1007, "TIMEOUT", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1013, "INVALID_MESSAGE", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1014, "UNKNOWN_ORDER_COMPOSITION", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1015, "TOO_MANY_ORDERS", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1016, "SERVICE_SHUTTING_DOWN", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1020, "UNSUPPORTED_OPERATION", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1021, "INVALID_TIMESTAMP", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1022, "INVALID_SIGNATURE", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1100, "ILLEGAL_CHARS", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1101, "TOO_MANY_PARAMETERS", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1102, "MANDATORY_PARAM_EMPTY_OR_MALFORMED", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1103, "UNKNOWN_PARAM", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1104, "UNREAD_PARAMETERS", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1105, "PARAM_EMPTY", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1106, "PARAM_NOT_REQUIRED", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-1130, "INVALID_PARAMETER", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-2008, "BAD_API_ID", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-2009, "DUPLICATE_API_KEY_DESC", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-2010, "INSUFFICIENT_BALANCE", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-2012, "CANCEL_ALL_FAIL", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-2013, "NO_SUCH_ORDER", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-2014, "BAD_API_KEY_FMT", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com"),
    new ErrorHandler(-2015, "REJECTED_MBX_KEY", EMethod_1.EMethod.GET, EErrorType_1.EErrorType.Binance, 4001, false, "http://localhost", "michael.mcanulty88@gmail.com")
];
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map