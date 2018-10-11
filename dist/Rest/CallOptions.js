"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiHeader_1 = require("./ApiHeader");
class CallOptions {
    toObjLiteral() {
        let requestOpts = {};
        requestOpts.uri = this.uri;
        requestOpts.method = this.method;
        requestOpts.headers = this.headers;
        requestOpts.json = this.json;
        requestOpts.qs = this.qs;
        requestOpts.resolveWithFullResponse = this.resolveWithFullResponse;
        return requestOpts;
    }
    constructor(options) {
        this.uri = options.uri;
        this.headers = options.headers;
        this.method = options.method;
        this.json = options.json || true;
        this.isSigned = options.isSigned || false;
        this.apiKey = options.apiKey || undefined;
        this.qs = options.qs || undefined;
        this.resolveWithFullResponse = options.resolveWithFullResponse || true;
        if (this.apiKey || options.headers) {
            this.headers = options.headers || new ApiHeader_1.ApiHeader(this.apiKey);
        }
    }
}
exports.CallOptions = CallOptions;
//# sourceMappingURL=CallOptions.js.map