"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiHeader_1 = require("./ApiHeader");
class CallOptions {
    toDBFormat() {
        let dbFormat = {};
        dbFormat.method = this.method;
        dbFormat.noExtra = this.noExtra;
        dbFormat.json = this.json;
        dbFormat.headers = this.headers;
        return dbFormat;
    }
    constructor(options, apiKey) {
        this.method = options.method;
        this.json = options.json || true;
        this.noData = options.noData || false;
        this.noExtra = options.noExtra || false;
        if (apiKey || options.headers) {
            this.headers = options.headers || new ApiHeader_1.ApiHeader(apiKey);
        }
    }
}
exports.CallOptions = CallOptions;
//# sourceMappingURL=CallOptions.js.map