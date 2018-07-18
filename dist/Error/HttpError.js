"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const EErrorType_1 = require("./Email/Enums/EErrorType");
const BinanceError_1 = require("./BinanceError");
const ErrorHandler_1 = require("./ErrorHandler");
class HttpError extends Error {
	constructor(err) {
		super();
		this.code = parseInt(err.code.toString());
		let type = HttpError.GetErrorType(err);
		this.message = (type === EErrorType_1.EErrorType.Binance) ? err['msg'] : err['message'];
		if (type === EErrorType_1.EErrorType.Binance) {
			let matched = BinanceError_1.BinanceError.GetBinanceErrorByCode(this.code);
			if (matched && matched !== null) {
				this.handler = ErrorHandler_1.ErrorHandler.GetErrorHandler(this.code, EErrorType_1.EErrorType.Binance);
			}
		}
		else {
			let matched = HttpError.GetHttpErrorByCode(this.code);
			if (matched && matched !== null) {
				this.handler = ErrorHandler_1.ErrorHandler.GetErrorHandler(this.code, EErrorType_1.EErrorType.Node);
			}
		}
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

	static GetHttpErrorByCode(code) {
		let result = null;
		if (HttpError.all && HttpError.all.length > 0) {
			let filtered = HttpError.all.filter(handler => handler.code === code);
			if (filtered && filtered.length > 0) {
				result = filtered[0];
			}
		}
		return result;
	}
}
exports.HttpError = HttpError;
//# sourceMappingURL=HttpError.js.map