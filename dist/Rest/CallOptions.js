"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiHeader_1 = require("./ApiHeader");
class CallOptions {
    toRequestOptions() {
        let requestOpts = {};
        requestOpts.uri = this.uri;
        requestOpts.method = this.method;
        requestOpts.headers = this.headers;
        requestOpts.json = this.json;
        requestOpts.qs = this.qs;
        return requestOpts;
    }
    constructor(options) {
        this.uri = options.uri;
        this.headers = options.headers;
        this.method = options.method;
        this.json = options.json || true;
        this.isSigned = options.isSigned || false;
        this.apiKey = options.apiKey || null;
        this.qs = options.qs || null;
        if (this.apiKey || options.headers) {
            this.headers = options.headers || new ApiHeader_1.ApiHeader(this.apiKey);
        }
    }
}
exports.CallOptions = CallOptions;
//# sourceMappingURL=CallOptions.js.map