"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const EErrorType_1 = require("./Email/Enums/EErrorType");
const ErrorHandler_1 = require("./ErrorHandler");

class BinanceError {
	constructor(err) {
		this.code = parseInt(err.code.toString());
		this.msg = (typeof err['msg'] === "string") ? err['msg'] : err['message'];
		let matched = BinanceError.GetBinanceErrorByCode(this.code);
		if (matched !== null) {
			this.handler = ErrorHandler_1.ErrorHandler.GetErrorHandler(this.code, EErrorType_1.EErrorType.Binance);
			if (this.code === BinanceError.TOO_MANY_REQUESTS_CODE) {
				this.handler.timeout = BinanceError.GetTimeoutFromIPBannedMsg(err);
			}
		}
	}

	static GetBinanceErrorByCode(code) {
		let filtered = BinanceError.all.filter(handler => handler.code === code);
		let result;
		if (filtered && filtered.length > 0) {
			result = filtered[0];
		}
		return result;
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

BinanceError.TOO_MANY_REQUESTS_CODE = -1003;
exports.BinanceError = BinanceError;
//# sourceMappingURL=BinanceError.js.map