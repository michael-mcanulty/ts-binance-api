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
class HttpError extends Error {
    constructor(code, message, handler) {
        super();
        this.code = code;
        this.message = message;
        if (handler) {
            this.handler = handler;
            (() => __awaiter(this, void 0, void 0, function* () {
                yield this.handler.handleError(code, message);
            }))();
        }
    }
    static _getErrorByCode(code) {
        let result;
        if (HttpError.binanceErrors.length > 0) {
            let filtered = HttpError.binanceErrors.filter(handler => handler.code === code);
            if (filtered && filtered.length > 0) {
                result = filtered[0];
            }
        }
        return result;
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
HttpError.binanceErrors = [
    new HttpError(-1000, "UNKNOWN"),
    new HttpError(-1001, "DISCONNECTED"),
    new HttpError(-1002, "UNAUTHORIZED"),
    new HttpError(-1003, "TOO_MANY_REQUESTS"),
    new HttpError(-1006, "UNEXPECTED_RESP"),
    new HttpError(-1007, "TIMEOUT"),
    new HttpError(-1013, "INVALID_MESSAGE"),
    new HttpError(-1014, "UNKNOWN_ORDER_COMPOSITION"),
    new HttpError(-1015, "TOO_MANY_ORDERS"),
    new HttpError(-1016, "SERVICE_SHUTTING_DOWN"),
    new HttpError(-1020, "UNSUPPORTED_OPERATION"),
    new HttpError(-1021, "INVALID_TIMESTAMP"),
    new HttpError(-1022, "INVALID_SIGNATURE"),
    new HttpError(-1100, "ILLEGAL_CHARS"),
    new HttpError(-1101, "TOO_MANY_PARAMETERS"),
    new HttpError(-1102, "MANDATORY_PARAM_EMPTY_OR_MALFORMED"),
    new HttpError(-1103, "UNKNOWN_PARAM"),
    new HttpError(-1104, "UNREAD_PARAMETERS"),
    new HttpError(-1105, "PARAM_EMPTY"),
    new HttpError(-1106, "PARAM_NOT_REQUIRED"),
    new HttpError(-1130, "INVALID_PARAMETER"),
    new HttpError(-2008, "BAD_API_ID"),
    new HttpError(-2009, "DUPLICATE_API_KEY_DESC"),
    new HttpError(-2010, "INSUFFICIENT_BALANCE"),
    new HttpError(-2012, "CANCEL_ALL_FAIL"),
    new HttpError(-2013, "NO_SUCH_ORDER"),
    new HttpError(-2014, "BAD_API_KEY_FMT"),
    new HttpError(-2015, "REJECTED_MBX_KEY")
];
exports.HttpError = HttpError;
//# sourceMappingURL=HttpError.js.map