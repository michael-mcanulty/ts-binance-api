"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EErrorType_1 = require("./Enums/EErrorType");
const HttpErrorHandler_1 = require("./HttpErrorHandler");
const EMethod_1 = require("../Rest/EMethod");
class HttpError extends Error {
    constructor(code, message, handler, isFatal) {
        super();
        this.code = code;
        this.message = message;
        this.isFatal = isFatal;
        if (handler) {
            this.handler = handler;
        }
        else {
            let errHandler = HttpError._getErrorHandler(this);
            if (errHandler !== null) {
                this.handler = errHandler;
            }
        }
    }
    static fromObjLiteral(err) {
        if (!err)
            return;
        let handler = new HttpErrorHandler_1.HttpErrorHandler(err.handler);
        return new HttpError(err.code, err.message, handler);
    }
    static toObjLiteral(err) {
        if (!err)
            return;
        let error = {};
        error.code = err.code;
        error.message = err.message;
        error.handler = {};
        error.handler.emailServiceOpts = err.handler.emailServiceOpts;
        error.handler.emailMsgOpts = err.handler.emailMsgOpts;
        error.handler.endpoint = err.handler.endpoint;
        error.handler.method = EMethod_1.EMethod[err.handler.method];
        error.handler.type = EErrorType_1.EErrorType[err.handler.type];
        error.handler.payload = err.handler.payload;
        error.handler.restartSingleWorker = err.handler.restartSingleWorker;
        error.handler.sendEmail = err.handler.sendEmail;
        return error;
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
    static _getErrorHandler(error) {
        if (!HttpError.allErrors || HttpError.allErrors.length === 0) {
            let match = HttpError._objErrors.filter(err => err.code === error.code);
            if (Array.isArray(match) && typeof match[0] === "object") {
                return null;
            }
        }
        else {
            let match = HttpError.allErrors.filter(err => err.code === error.code);
            if (Array.isArray(match) && typeof match[0] === "object" && typeof match[0].handler === "object" && match[0].handler instanceof HttpErrorHandler_1.HttpErrorHandler) {
                return match[0].handler;
            }
            else {
                return null;
            }
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
    static getErrorByCode(code) {
        if (!code) {
            return null;
        }
        if (!HttpError.allErrors || HttpError.allErrors.length === 0) {
            let match = HttpError._objErrors.filter(err => err.code === code);
            if (Array.isArray(match) && typeof match[0] === "object") {
                return HttpError.fromObjLiteral(match[0]);
            }
        }
        else {
            let result;
            if (HttpError.allErrors.length > 0) {
                let filtered = HttpError.allErrors.filter(handler => {
                    return (typeof code === "number" && handler.code === code);
                });
                if (filtered && filtered.length > 0) {
                    result = filtered[0];
                }
            }
            return result;
        }
    }
    static init(options, _jsonErrs) {
        HttpErrorHandler_1.HttpErrorHandler.emailServiceOptions = options.emailServiceOpts;
        HttpErrorHandler_1.HttpErrorHandler.emailMsgOptions = options.emailMsgOpts;
        HttpErrorHandler_1.HttpErrorHandler.textMsgOptions = options.txtMsgOpts;
        if (_jsonErrs && _jsonErrs.length > 0) {
            HttpError._objErrors = _jsonErrs;
        }
        HttpError.allErrors = HttpError._objErrors.map(err => {
            err.handler.emailMsgOpts = options.emailMsgOpts;
            err.handler.emailServiceOpts = options.emailServiceOpts;
            err.handler.textMsgOpts = options.txtMsgOpts;
            return new HttpError(err.code, err.message, new HttpErrorHandler_1.HttpErrorHandler(err.handler));
        });
        return HttpError.allErrors;
    }
    static isHttpError(err) {
        return err && err instanceof HttpError;
    }
}
HttpError._objErrors = [
    {
        code: 88880, message: "MongoNetworkError",
        handler: {
            type: EErrorType_1.EErrorType.MongoDB,
            sendEmail: true,
            sendText: true,
            endpoint: ["http://localhost:3001/kill"],
        }
    },
    {
        code: 127, message: "ECONNREFUSED",
        handler: {
            type: EErrorType_1.EErrorType.Node,
            sendEmail: false,
            sendText: false
        }
    },
    {
        code: 401, message: "UNAUTHORIZED",
        handler: {
            type: EErrorType_1.EErrorType.Node,
            sendEmail: true,
            sendText: true,
            endpoint: ["http://localhost:3002/kill/app", "http://localhost:3001/kill/app"],
            method: EMethod_1.EMethod.POST
        }
    },
    {
        code: -1000, message: "UNKNOWN",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: true,
            sendText: true
        }
    },
    {
        code: -1001, message: "DISCONNECTED",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: true,
            sendText: true,
            endpoint: ["http://localhost:3002/kill/workers", "http://localhost:3001/kill/workers"]
        }
    },
    {
        code: -1002, message: "UNAUTHORIZED", isFatal: true,
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: true,
            sendText: true,
            endpoint: ["http://localhost:3002/kill/app", "http://localhost:3001/kill/app"],
            method: EMethod_1.EMethod.POST
        }
    },
    {
        code: -1003, message: "TOO_MANY_REQUESTS",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: true,
            sendText: true
        }
    },
    {
        code: -1006, message: "UNEXPECTED_RESP",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: true,
            sendText: true
        }
    },
    {
        code: -1007, message: "TIMEOUT",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: true,
            sendText: true,
            endpoint: ["http://localhost:3002/kill/workers", "http://localhost:3001/kill/workers"]
        }
    },
    {
        code: -1013, message: "INVALID_MESSAGE",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: false,
            sendText: false
        }
    },
    {
        code: -1014, message: "UNKNOWN_ORDER_COMPOSITION",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: false,
            sendText: false
        }
    },
    {
        code: -1015, message: "TOO_MANY_ORDERS",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: true,
            sendText: true,
            restartSingleWorker: true,
            endpoint: ["http://localhost:3001/kill", "http://localhost:3002/kill"],
            method: EMethod_1.EMethod.POST
        }
    },
    {
        code: -1016, message: "SERVICE_SHUTTING_DOWN", isFatal: true,
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendEmail: true,
            sendText: true,
            endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"],
            method: EMethod_1.EMethod.POST
        }
    },
    {
        code: -1020, message: "UNSUPPORTED_OPERATION",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -1021, message: "INVALID_TIMESTAMP",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -1022, message: "INVALID_SIGNATURE",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -1100, message: "ILLEGAL_CHARS",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -1101, message: "TOO_MANY_PARAMETERS",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true,
            endpoint: []
        }
    },
    {
        code: -1102, message: "MANDATORY_PARAM_EMPTY_OR_MALFORMED",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true,
            endpoint: []
        }
    },
    {
        code: -1103, message: "UNKNOWN_PARAM",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -1104, message: "UNREAD_PARAMETERS",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -1105, message: "PARAM_EMPTY",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -1106, message: "PARAM_NOT_REQUIRED",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -1130, message: "INVALID_PARAMETER",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -2008, message: "BAD_API_ID",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true,
            endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
        }
    },
    {
        code: -2009, message: "DUPLICATE_API_KEY_DESC", isFatal: true,
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true,
            endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
        }
    },
    {
        code: -2010, message: "INSUFFICIENT_BALANCE",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -2012, message: "CANCEL_ALL_FAIL",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true,
            endpoint: []
        }
    },
    {
        code: -2013, message: "NO_SUCH_ORDER",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
    {
        code: -2014, message: "BAD_API_KEY_FMT", isFatal: true,
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true,
            endpoint: ["http://localhost:3001/kill/app", "http://localhost:3002/kill/app"]
        }
    },
    {
        code: -2015, message: "REJECTED_MBX_KEY",
        handler: {
            type: EErrorType_1.EErrorType.Binance,
            sendText: true,
            sendEmail: true
        }
    },
];
exports.HttpError = HttpError;
//# sourceMappingURL=HttpError.js.map