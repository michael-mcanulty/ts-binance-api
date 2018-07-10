"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	return new (P || (P = Promise))(function (resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}

		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}

		function step(result) {
			result.done ? resolve(result.value) : new P(function (resolve) {
				resolve(result.value);
			}).then(fulfilled, rejected);
		}

		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
Object.defineProperty(exports, "__esModule", {value: true});
const EMethod_1 = require("../Rest/EMethod");
const BotHttp_1 = require("../Rest/BotHttp");
const NodeMailer_1 = require("./Email/NodeMailer");
const EErrorType_1 = require("./Email/Enums/EErrorType");
class ErrorHandler {
	constructor(code, port, type, method, sendEmail, timeout, emailAddress, emailOptions, endpoint = "http://localhost") {
		this.type = type;
		this.code = code;
		this.port = port || null;
		this.method = method;
		this.emailAddress = emailAddress || null;
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint;
		this.timeout = timeout || 0;
		let url = `${this.endpoint}:${this.port}`;
		let props = {"timeout": this.timeout, "restart": this.restart, "shutdown": this.shutdown};
		url += BotHttp_1.BotHttp.makeQueryString(props);
		this.url = url;
	}

	static GetErrorHandler(code, type) {
		let result;
		if (ErrorHandler.allItems && ErrorHandler.allItems.length > 0) {
			let filtered = ErrorHandler.allItems.filter(handler => {
				return handler.code === code && handler.type === type;
			});
			if (filtered && filtered.length > 0) {
				result = filtered[0];
			}
		}
		return result;
	}

	executeApi(error) {
		if (this.port !== null && this.method !== null) {
			let reqOpts = {};
			reqOpts.method = EMethod_1.EMethod[this.method];
			reqOpts.headers = new Headers();
			if (this.sendEmail && this.emailOptions) {
				ErrorHandler.emailService = new NodeMailer_1.NodeMailer(this.emailOptions);
				let msgOptions = {};
				msgOptions.from = this.emailAddress;
				msgOptions.to = this.emailAddress;
				let message = (this.type === EErrorType_1.EErrorType.Binance) ? error['msg'] : error['message'];
				msgOptions.subject = `A new ${EErrorType_1.EErrorType[this.type] || "Unknown"} error has been received | ${message}`;
				msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${error.code} \n Message: ${message}`;
				return ErrorHandler.emailService.sendEmail(msgOptions).then((success) => __awaiter(this, void 0, void 0, function* () {
					yield BotHttp_1.BotHttp.fetch(this.url, reqOpts);
				}));
			}
			else {
				return BotHttp_1.BotHttp.fetch(this.url, reqOpts);
			}
		}
	}
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map