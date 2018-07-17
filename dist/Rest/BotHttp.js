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
const Fetch = require("isomorphic-fetch");
const crypto = require("crypto");
const HttpError_1 = require("../Error/HttpError");
const EMethod_1 = require("./EMethod");
const Signed_1 = require("./Signed");
const ApiHeader_1 = require("./ApiHeader");
const CallOptions_1 = require("./CallOptions");

class BotHttp {
	constructor(options) {
		this.options = options;
	}

	static makeQueryString(params) {
		let result;
		let keys;
		keys = Object.keys(params).filter(k => params[k]);
		if (!params) {
			result = "";
		}
		else {
			result = `?${keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')}`;
		}
		return result;
	}

	buildUrl(path, noData, data) {
		return `${BotHttp.BASE}${path.includes('/wapi') ? '' : '/api'}${path}${noData ? '' : BotHttp.makeQueryString(data)}`;
	}

	call(path, callOptions, payload) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			try {
				result = yield this.fetch(path, callOptions, payload);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	fetch(path, callOptions, payload) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let err;
				let url = this.buildUrl(path, callOptions.noData, payload);
				let res = yield BotHttp.fetch(url, callOptions);
				let json = yield res.json();
				let binanceError;
				let errObj = {"message": res.statusText, "code": res.status};
				if (json) {
					binanceError = json;
				}
				if (res.ok === false) {
					if (!binanceError) {
						err = new HttpError_1.HttpError(errObj);
						reject(err);
					}
					else if (binanceError) {
						err = new HttpError_1.HttpError(binanceError);
						reject(err);
					}
				}
				else {
					resolve(json);
				}
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	getSignature(payload, timestamp) {
		let signature = crypto.createHmac('sha256', this.options.auth.secret).update(BotHttp.makeQueryString(Object.assign(payload, timestamp)).substr(1)).digest('hex');
		return signature;
	}

	getTimestamp() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let time = {};
			if (this.options.useServerTime) {
				try {
					time.timestamp = yield this.timestamp();
					resolve(time);
				}
				catch (err) {
					reject(err);
				}
			}
			else {
				time.timestamp = Date.now();
				resolve(time);
			}
		}));
	}

	ping() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let opts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
				yield this.call('/v1/ping', opts);
				resolve(true);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	privateCall(path, callOptions, payload) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			let signature;
			if (!payload) {
				payload = new Signed_1.Signed();
			}
			try {
				let tStamp = yield this.getTimestamp();
				callOptions.headers = new ApiHeader_1.ApiHeader(this.options.auth.key);
				signature = yield this.getSignature(payload, tStamp);
				if (!callOptions.noExtra) {
					payload.timestamp = tStamp.timestamp;
					payload.signature = signature;
				}
				result = yield this.fetch(path, callOptions, payload);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	time() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let opts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
				let server = yield this.call('/v1/time', opts);
				resolve(server);
			}
			catch (err) {
				reject(`Error in server time sync. Message: ${err}`);
			}
		}));
	}

	timestamp() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let time = yield this.time();
				resolve(time.serverTime);
			}
			catch (err) {
				reject(`Error in server time sync. Message: ${err}`);
			}
		}));
	}
}

BotHttp.BASE = 'https://api.binance.com';
BotHttp.fetch = Fetch;
exports.BotHttp = BotHttp;
//# sourceMappingURL=BotHttp.js.map