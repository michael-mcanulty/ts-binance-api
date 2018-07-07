"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const EMethod_1 = require("../Rest/EMethod");
const BBRest_1 = require("../Rest/BBRest");
const NodeMailer_1 = require("./Email/NodeMailer");
const HttpError_1 = require("./HttpError");
const EErrorType_1 = require("./Email/Enums/EErrorType");

class ErrorResponse {
	constructor(code, port, method, sendEmail, timeout, emailAddress, emailOptions, endpoint = "http://localhost") {
		this.port = port || null;
		this.method = method;
		this.emailAddress = emailAddress || null;
		this.sendEmail = sendEmail || false;
		this.endpoint = endpoint;
		this.timeout = timeout || 0;
		let url = `${this.endpoint}:${this.port}`;
		let props = {"timeout": this.timeout, "restart": this.restart, "shutdown": this.shutdown};
		url += BBRest_1.BBRest.makeQueryString(props);
		this._url = url;
	}

	executeApi(error) {
		if (this.port !== null && this.method !== null) {
			let reqOpts = {};
			reqOpts.method = EMethod_1.EMethod[this.method];
			reqOpts.headers = new Headers();
			if (this.sendEmail && this.emailOptions) {
				this.emailService = new NodeMailer_1.NodeMailer(this.emailOptions);
				let msgOptions = {};
				msgOptions.from = this.emailAddress;
				msgOptions.to = this.emailAddress;
				let errType = HttpError_1.HttpError.GetErrorType(error);
				let message = (errType === EErrorType_1.EErrorType.Binance) ? error['msg'] : error['message'];
				msgOptions.subject = `A new ${EErrorType_1.EErrorType[errType] || "Unknown"} error has been received | ${message}`;
				msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${error.code} \n Message: ${message}`;
				return this.emailService.sendEmail(msgOptions).then(success => {
					return BBRest_1.BBRest.fetch(this._url, reqOpts);
				});
			}
			else {
				return BBRest_1.BBRest.fetch(this._url, reqOpts);
			}
		}
	}
}

exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=Resolution.js.map