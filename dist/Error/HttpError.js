"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
class HttpError extends Error {
	constructor(msg, code) {
		super();
		this.message = msg;
		this.code = code;
	}
}
exports.HttpError = HttpError;
//# sourceMappingURL=HttpError.js.map