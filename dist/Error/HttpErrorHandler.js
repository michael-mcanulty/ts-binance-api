"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EMethod_1 = require("../Rest/EMethod");
const BotHttp_1 = require("../Rest/BotHttp");
const NodeMailer_1 = require("./Email/NodeMailer");
const BBLogger_1 = require("../Logger/BBLogger");
const EErrorType_1 = require("../Error/Email/Enums/EErrorType");
const HttpError_1 = require("./HttpError");
class HttpErrorHandler {
    static hasHandler(err) {
        return (err && HttpError_1.HttpError.isHttpError(err) && err.handler instanceof HttpErrorHandler);
    }
    execute(err, port, workerId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let errHasHandler = HttpErrorHandler.hasHandler(err);
                if (errHasHandler) {
                    if (!err.handler.emailMsgOpts) {
                        err.handler.emailMsgOpts = HttpErrorHandler.emailMsgOptions;
                    }
                    if (!err.handler.emailServiceOpts || !err.handler.emailServiceOpts.auth) {
                        err.handler.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
                    }
                    let opts = {};
                    opts.code = err.code;
                    opts.message = err.message;
                    opts.killWorker = err.handler.killWorkerOnError;
                    opts.workerId = workerId;
                    opts.originAddress = `http://localhost:${port}`;
                    let remoteEndpoints = [];
                    let _endpoint;
                    if ((this.method != undefined && this.method !== null) && this.endpoint) {
                        _endpoint = (Array.isArray(this.endpoint)) ? this.endpoint : new Array(this.endpoint);
                        remoteEndpoints = _endpoint;
                        if (opts.originAddress && _endpoint.length > 1) {
                            remoteEndpoints = _endpoint.filter(e => e !== opts.originAddress);
                        }
                    }
                    let reqOpts = {};
                    reqOpts.method = EMethod_1.EMethod[this.method];
                    reqOpts.headers = new Headers();
                    reqOpts.headers.set("Content-Type", "application/json");
                    reqOpts.body = this.payload || null;
                    if (!this.killAppOnError && this.payload || (this.killWorkerOnError && workerId)) {
                        reqOpts.body = (this.payload) ? JSON.stringify(this.payload) : JSON.stringify({ "workerId": workerId });
                    }
                    if (this.sendEmail && this.emailMsgOpts && (this.emailServiceOpts || HttpErrorHandler.emailServiceOptions)) {
                        HttpErrorHandler.mailService = new NodeMailer_1.NodeMailer();
                        this.emailMsgOpts.subject = (!this.emailMsgOpts.subject || this.emailMsgOpts.subject.length === 0) ? `${opts.message} ${this.type || "Unknown"} Error Received` : this.emailMsgOpts.subject;
                        this.emailMsgOpts.text = (!this.emailMsgOpts.text || this.emailMsgOpts.text.length === 0) ? `Error code: ${opts.code} \n Message: ${opts.message}` : this.emailMsgOpts.text;
                        let defaultServiceOpts = HttpErrorHandler.emailServiceOptions;
                        yield HttpErrorHandler.mailService.sendEmail(this.emailMsgOpts, this.emailServiceOpts || defaultServiceOpts);
                        for (let endpoint of remoteEndpoints) {
                            yield postToEndpoint(endpoint, reqOpts, reject);
                        }
                        if (opts.originAddress && _endpoint.length > remoteEndpoints.length) {
                            yield postToEndpoint(opts.originAddress, reqOpts, reject);
                        }
                    }
                    resolve();
                }
            }
            catch (err) {
                yield BBLogger_1.BBLogger.error(err);
                reject(err);
            }
        }));
        function postToEndpoint(endpoint, reqOpts, errorCallback) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let fetch = {};
                    fetch = yield BotHttp_1.BotHttp.fetch(endpoint, reqOpts);
                }
                catch (err) {
                    if (err && typeof err.errno === "string" && err.errno !== "ECONNREFUSED") {
                        yield BBLogger_1.BBLogger.error(err.message);
                        errorCallback(err);
                    }
                    else {
                        yield BBLogger_1.BBLogger.warning("Tried to kill a dead server.");
                    }
                }
            });
        }
    }
    constructor(config) {
        this.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
        this.emailMsgOpts = (HttpErrorHandler.emailMsgOptions) ? HttpErrorHandler.emailMsgOptions : {};
        if (config) {
            if (config.endpoint) {
                this.endpoint = (Array.isArray(config.endpoint)) ? config.endpoint : new Array(config.endpoint);
            }
            this.method = config.method;
            this.type = EErrorType_1.EErrorType[config.type] || EErrorType_1.EErrorType[EErrorType_1.EErrorType.Binance];
            this.sendEmail = config.sendEmail;
            this.payload = config.payload;
            this.killAppOnError = config.killAppOnError;
            this.killWorkerOnError = config.killWorkerOnError;
            if (config.emailServiceOpts && typeof config.emailServiceOpts.auth === "object") {
                this.emailServiceOpts = config.emailServiceOpts;
            }
            this.emailMsgOpts = config.emailMsgOpts;
        }
    }
}
exports.HttpErrorHandler = HttpErrorHandler;
//# sourceMappingURL=HttpErrorHandler.js.map