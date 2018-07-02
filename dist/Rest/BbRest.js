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
const fetch = require("isomorphic-fetch");
const crypto = require("crypto");
const HttpError_1 = require("../Error/HttpError");
const eMethod_1 = require("./eMethod");
class BbRest {
	constructor(options) {
		this.options = options;
	}

	_call(path, data, callOptions) {
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
			callOptions.method = eMethod_1.eMethod.GET;
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
				signature = crypto.createHmac('sha256', this.auth.secret).update(this.makeQueryString(Object.assign({}, data, {timestamp})).substr(1)).digest('hex');
				newData = callOptions.noExtra ? data : Object.assign({}, data, {timestamp, signature});
				result = yield this.fetch(fetchPath, newData, callOptions);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	buildUrl(path, data, noData) {
		return `${BbRest.BASE}${path.includes('/wapi') ? '' : '/app'}${path}${noData ? '' : this.makeQueryString(data)}`;
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

	checkParams(name, payload, requires) {
		if (!payload) {
			throw new Error('You need to pass a payload object.');
		}
		requires.forEach(r => {
			if (!payload[r] && isNaN(payload[r])) {
				throw new Error(`Method ${name} requires ${r} parameter.`);
			}
		});
		return true;
	}

	fetch(path, payload, callOptions) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let json;
			let msg;
			let err;
			if (typeof callOptions.noData !== "boolean") {
				callOptions.noData = false;
			}
			let params = this.buildUrl(path, payload, callOptions.noData);
			let reqOpts = {};
			reqOpts.method = eMethod_1.eMethod[eMethod_1.eMethod.GET];
			reqOpts.headers = new Headers();
			try {
				let res = yield fetch(params, reqOpts);
				json = yield res.json();
				if (!res.ok) {
					err = new HttpError_1.HttpError(res.statusText, json.code);
					reject(err);
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

	makeQueryString(params) {
		let result;
		if (!params) {
			result = "";
		}
		else {
			const esc = encodeURIComponent;
			result = Object.keys(params).map(k => `?${esc(k)}=${esc(params[k])}`).join('&');
		}
		return result;
	}

	ping() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let opts = {};
				opts.noData = true;
				let res = yield this.call('/v1/ping', null, opts);
				let ping = (Object.keys(res).length === 0);
				if (ping) {
					resolve(ping);
				}
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
BbRest.BASE = 'https://app.binance.com';
exports.BbRest = BbRest;
//# sourceMappingURL=BbRest.js.map