"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const EMethod_1 = require("./EMethod");
const ApiHeader_1 = require("./ApiHeader");
class CallOptions {
	constructor(method, json, noData, noExtra, apiKey, headers) {
		this.method = EMethod_1.EMethod[method];
		this.json = json || true;
		this.noData = noData || false;
		this.noExtra = noExtra || false;
		if (apiKey || headers) {
			this.headers = headers || new ApiHeader_1.ApiHeader(apiKey);
		}
	}
}
exports.CallOptions = CallOptions;
//# sourceMappingURL=CallOptions.js.map