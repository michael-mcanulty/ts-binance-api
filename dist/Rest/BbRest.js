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
class BBRest {
	constructor(options) {
		this.options = options;
	}

	static makeQueryString(params) {
		let result;
		if (!params) {
			result = "";
		}
		else {
			result = `?${Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')}`;
		}
		return result;
	}

	buildUrl(path, data, noData) {
		return `${BBRest.BASE}${path.includes('/wapi') ? '' : '/api'}${path}${noData ? '' : BBRest.makeQueryString(data)}`;
	}

	privateCall(path, data, callOptions) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			let signature;
			let timestamp;
			let newData;
			let headersInit = [['X-MBX-APIKEY', this.auth.key]];
			let headers = new Headers(headersInit);
			if (!callOptions) {
				callOptions = {};
				callOptions.noData = false;
			}
			let fetchPath = this.buildUrl(path, data, callOptions.noData);
			callOptions.headers = headers;
			callOptions.method = EMethod_1.EMethod.GET;
			callOptions.json = true;
			if (!this.auth.key || !this.auth.secret) {
				throw new Error('You need to pass an API key and secret to make authenticated calls.');
			}
			try {
				if (data && this.options.useServerTime) {
					timestamp = yield this.call('/v1/time');
				}
				else {
					timestamp.serverTime = Date.now();
				}
				signature = crypto.createHmac('sha256', this.auth.secret).update(BBRest.makeQueryString(Object.assign({}, data, {timestamp})).substr(1)).digest('hex');
				newData = callOptions.noExtra ? data : Object.assign({}, data, {timestamp, signature});
				result = yield this.fetch(fetchPath, newData, callOptions);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	call(path, data, callOptions) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			if (!callOptions) {
				callOptions = {};
				callOptions.noData = false;
			}
			try {
				result = yield this.fetch(path, data, callOptions);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	fetch(path, payload, callOptions) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let json;
			let err;
			if (typeof callOptions.noData !== "boolean") {
				callOptions.noData = false;
			}
			let params = this.buildUrl(path, payload, callOptions.noData);
			let reqOpts = {};
			reqOpts.method = EMethod_1.EMethod[EMethod_1.EMethod.GET];
			reqOpts.headers = new Headers();
			try {
				let res = yield BBRest.fetch(params, reqOpts);
				json = yield res.json();
				if (res.ok === false) {
					err = new HttpError_1.HttpError(json);
					if (typeof err.handler === "function") {
						err['handler'].executeApi(err).then(success => {
							reject(err);
						});
					}
					else {
						reject(new HttpError_1.HttpError(json));
					}
				}
				else {
					resolve(json);
				}
			}
			catch (err) {
				if (typeof err.json === "function") {
					json = yield err.json();
					let _error = new HttpError_1.HttpError(json);
					if (_error && typeof _error.handler === "function") {
						_error['handler'].executeApi(err).then(success => {
							reject(err);
						});
					}
					else {
						reject(new HttpError_1.HttpError(_error));
					}
				}
				else {
					let _error = new HttpError_1.HttpError(err);
					if (_error && typeof _error.handler === "function") {
						_error['handler'].executeApi(err).then(success => {
							reject(err);
						});
					}
					else {
						reject(new HttpError_1.HttpError(_error));
					}
				}
			}
		}));
	}

	ping() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let opts = {};
				opts.noData = true;
				let res = yield this.call('/v1/ping', null, opts);
				resolve(true);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	time() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let opts = {};
				let time;
				opts.noData = true;
				let server = yield this.call('/v1/time', null, opts);
				time = server.serverTime;
				resolve(time);
			}
			catch (err) {
				reject(`Error in server time sync. Message: ${err}`);
			}
		}));
	}
}

BBRest.BASE = 'https://http.binance.com';
BBRest.fetch = Fetch;
exports.BBRest = BBRest;
//# sourceMappingURL=BbRest.js.map