"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EMethod_1 = require("../Rest/EMethod");
const BotHttp_1 = require("../Rest/BotHttp");
const NodeMailer_1 = require("./NodeMailer");
const BBLogger_1 = require("../Logger/BBLogger");
const EErrorType_1 = require("./Enums/EErrorType");
const HttpError_1 = require("./HttpError");
const url_1 = require("url");
const cluster_1 = require("cluster");
const TextMessage_1 = require("../TextMessage/TextMessage");
class HttpErrorHandler {
    constructor(config) {
        this.restartSingleWorker = false;
        this.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
        this.emailMsgOpts = (HttpErrorHandler.emailMsgOptions) ? HttpErrorHandler.emailMsgOptions : {};
        this.textMsgOpts = (HttpErrorHandler.textMsgOptions) ? HttpErrorHandler.textMsgOptions : {};
        if (config) {
            if (config.endpoint) {
                this.endpoint = (Array.isArray(config.endpoint)) ? config.endpoint : new Array(config.endpoint);
            }
            this.method = EMethod_1.EMethod[config.method];
            this.type = EErrorType_1.EErrorType[config.type] || EErrorType_1.EErrorType[EErrorType_1.EErrorType.Binance];
            this.sendEmail = config.sendEmail;
            this.sendText = config.sendText;
            this.payload = config.payload;
            if (config.emailServiceOpts && typeof config.emailServiceOpts.auth === "object") {
                this.emailServiceOpts = config.emailServiceOpts;
            }
            this.textMsgOpts = config.textMsgOpts;
            this.emailMsgOpts = config.emailMsgOpts;
        }
    }
    static hasHandler(err) {
        return (err && HttpError_1.HttpError.isHttpError(err) && err.handler instanceof HttpErrorHandler);
    }
    execute(err, srcUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                let origin = srcUrl.origin;
                if (err && HttpErrorHandler.hasHandler(err)) {
                    if (this.restartSingleWorker) {
                        this.payload.id = cluster_1.worker.id;
                    }
                    if (err.handler.emailMsgOpts) {
                        err.handler.emailMsgOpts = HttpErrorHandler.emailMsgOptions;
                    }
                    if (!err.handler.emailServiceOpts || !err.handler.emailServiceOpts.auth) {
                        err.handler.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
                    }
                    let opts = {};
                    opts.code = err.code;
                    opts.message = err.message;
                    let remoteEndpoints = [];
                    let _endpoint;
                    if ((err.handler.method != undefined && err.handler.method !== null) && err.handler.endpoint) {
                        this.payload = { error: HttpError_1.HttpError.toObjLiteral(err) };
                        _endpoint = (Array.isArray(err.handler.endpoint)) ? err.handler.endpoint : new Array(err.handler.endpoint);
                        remoteEndpoints = _endpoint;
                        if (origin && _endpoint.length > 1) {
                            remoteEndpoints = _endpoint.filter(e => new url_1.URL(e).origin !== origin);
                        }
                    }
                    let reqOpts = {};
                    reqOpts.method = err.handler.method;
                    reqOpts.headers = new Headers();
                    reqOpts.headers.set("Content-Type", "application/json");
                    if (this.payload) {
                        reqOpts.body = JSON.stringify(this.payload);
                    }
                    if (err.handler.sendEmail && err.handler.emailMsgOpts && (err.handler.emailServiceOpts || HttpErrorHandler.emailServiceOptions)) {
                        HttpErrorHandler.mailService = new NodeMailer_1.NodeMailer();
                        err.handler.emailMsgOpts.subject = (!err.handler.emailMsgOpts.subject || err.handler.emailMsgOpts.subject.length === 0) ? `${opts.message} ${err.handler.type || "Unknown"} Error Received` : err.handler.emailMsgOpts.subject;
                        err.handler.emailMsgOpts.text = (!err.handler.emailMsgOpts.text || err.handler.emailMsgOpts.text.length === 0) ? `Error code: ${opts.code} \n Message: ${opts.message} \n Stack: ${err.stack}` : err.handler.emailMsgOpts.text;
                        let defaultServiceOpts = HttpErrorHandler.emailServiceOptions;
                        await HttpErrorHandler.mailService.sendEmail(err.handler.emailMsgOpts, err.handler.emailServiceOpts || defaultServiceOpts);
                    }
                    if (err.handler.sendText && (err.handler.textMsgOpts || HttpErrorHandler.textMsgOptions)) {
                        HttpErrorHandler.mailService = new NodeMailer_1.NodeMailer();
                        let msgConfig = {};
                        let isFatal = err.isFatal;
                        let isKnownErr = !!(err.handler.type);
                        msgConfig.subject = `${(isFatal) ? "Fatal" : ""}${(isKnownErr) ? EErrorType_1.EErrorType[err.handler.type] : "Unknown"} Error Received`;
                        msgConfig.text = `${opts.message}. \nSource: ${srcUrl.origin}`;
                        msgConfig.from = err.handler.textMsgOpts.from || HttpErrorHandler.textMsgOptions.from || HttpErrorHandler.emailMsgOptions.from;
                        msgConfig.to = TextMessage_1.TextMessage.GetEmailAddress;
                        let defaultServiceOpts = HttpErrorHandler.emailServiceOptions;
                        await HttpErrorHandler.mailService.sendEmail(err.handler.emailMsgOpts, err.handler.emailServiceOpts || defaultServiceOpts);
                    }
                    for (let ePoint of remoteEndpoints) {
                        await postToEndpoint(ePoint, reqOpts, reject);
                    }
                    if (origin && _endpoint.length > remoteEndpoints.length) {
                        let lastPoint = _endpoint.filter(e => new url_1.URL(e).origin === origin);
                        if (lastPoint && lastPoint.length > 0) {
                            await postToEndpoint(lastPoint[0], reqOpts, reject);
                        }
                    }
                }
                resolve();
            }
            catch (err) {
                BBLogger_1.BBLogger.error(err);
                reject(err);
            }
        });
        async function postToEndpoint(endpoint, reqOpts, errorCallback) {
            try {
                let res = await BotHttp_1.BotHttp.fetch(endpoint, reqOpts);
                if (res.ok === false) {
                    let error = new HttpError_1.HttpError(parseInt(res.status.toString()), res.statusText);
                    errorCallback(error);
                }
            }
            catch (err) {
                if (err && typeof err.errno === "string" && err.errno !== "ECONNREFUSED") {
                    BBLogger_1.BBLogger.error(err.message);
                    errorCallback(err);
                }
                else {
                    BBLogger_1.BBLogger.warning("Tried to kill a dead server.");
                }
            }
        }
    }
}
exports.HttpErrorHandler = HttpErrorHandler;
//# sourceMappingURL=HttpErrorHandler.js.map