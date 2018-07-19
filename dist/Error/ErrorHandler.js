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
	constructor(code, endpoint, port, type, method, sendEmail, emailAddress, emailOptions) {
		this.code = code;
		this.type = EErrorType_1.EErrorType[type];
		this.port = port || null;
		this.method = EMethod_1.EMethod[method];
		this.emailAddress = emailAddress || null;
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint;
		this.url = `${this.endpoint}:${this.port}`;
	}

	executeApi(error) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			if (this.port !== null && this.method !== null) {
				let reqOpts = {};
				reqOpts.method = EMethod_1.EMethod[this.method];
				reqOpts.headers = new Headers();
				if (this.sendEmail && this.emailOptions) {
					ErrorHandler.emailService = new NodeMailer_1.NodeMailer(this.emailOptions);
					let msgOptions = {};
					msgOptions.from = this.emailAddress;
					msgOptions.to = this.emailAddress;
					let message = (this.type === EErrorType_1.EErrorType[EErrorType_1.EErrorType.Binance]) ? error['msg'] : error['message'];
					msgOptions.subject = `A new ${EErrorType_1.EErrorType[this.type] || "Unknown"} error has been received | ${message}`;
					msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${error.code} \n Message: ${message}`;
					try {
						yield ErrorHandler.emailService.sendEmail(msgOptions);
					}
					catch (err) {
						reject(err);
					}
				}
				try {
					let fetch = yield BotHttp_1.BotHttp.fetch(this.url, reqOpts);
					resolve(fetch);
				}
				catch (err) {
					reject(err);
				}
			}
		}));
	}
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map