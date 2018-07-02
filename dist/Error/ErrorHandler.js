"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const ErrorCode_1 = require("./ErrorCode");

class ErrorHandler {
	constructor(code) {
		this.error = ErrorCode_1.ErrorCode.GetErrorByCode(code);
	}

	get action() {
		return this._action;
	}

	set action(value) {
		this._action = value;
	}

	get error() {
		return this._error;
	}

	set error(value) {
		this._error = value;
	}

	execute() {
	}
}

exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map