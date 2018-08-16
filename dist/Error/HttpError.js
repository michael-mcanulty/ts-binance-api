"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EErrorType_1 = require("./Email/Enums/EErrorType");
const HttpErrorHandler_1 = require("./HttpErrorHandler");
class HttpError extends Error {
    constructor(err) {
        super();
        this.code = parseInt(err.code.toString());
        let type = HttpError.GetErrorType(err);
        this.message = (type === EErrorType_1.EErrorType.Binance) ? err['msg'] : err['message'];
        let error = HttpError.GetErrorByCode(this.code);
        if (error) {
            this.handler = error.handler;
            if (error.handler && (!error.handler.code || !error.handler.message)) {
                error.handler.code = this.code;
                error.handler.message = this.message;
                error.handler.handleError(error);
            }
        }
    }
    static GetErrorByCode(code) {
        let result;
        if (HttpError.all.length > 0) {
            let filtered = HttpError.all.filter(handler => handler.code === code);
            if (filtered && filtered.length > 0) {
                result = filtered[0];
            }
        }
        return result;
    }
    static GetErrorType(err) {
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
}
HttpError.all = HttpErrorHandler_1.HttpErrorHandler.allErrors;
exports.HttpError = HttpError;
//# sourceMappingURL=HttpError.js.map