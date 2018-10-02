"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            this.method = config.method;
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
        HttpErrorHandler.mailService = new NodeMailer_1.NodeMailer();
    }
    async _postToEndpoint(endpoint, reqOpts) {
        try {
            let res = await BotHttp_1.BotHttp.fetch(endpoint, reqOpts);
            if (res.ok === false) {
                let error = new HttpError_1.HttpError(parseInt(res.status.toString()), res.statusText);
                return Promise.reject(error);
            }
        }
        catch (err) {
            if (err && typeof err.errno === "string" && err.errno !== "ECONNREFUSED") {
                BBLogger_1.BBLogger.error(err.message);
                throw err;
            }
            else {
                BBLogger_1.BBLogger.warning("Tried to kill a dead server.");
            }
        }
    }
    async execute(err, srcUrl) {
        try {
            let origin = srcUrl.origin;
            let srcServer = (srcUrl.port.charAt(-1) == "1") ? "Data Server" : "Analysis Server";
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
                    err.handler.emailMsgOpts.subject = (!err.handler.emailMsgOpts.subject || err.handler.emailMsgOpts.subject.length === 0) ? `${opts.message} ${err.handler.type || "Unknown"} Error on the ${srcServer}` : err.handler.emailMsgOpts.subject;
                    err.handler.emailMsgOpts.text = (!err.handler.emailMsgOpts.text || err.handler.emailMsgOpts.text.length === 0) ? `Error code: ${opts.code} \n Message: ${opts.message} \n Stack: ${err.stack}` : err.handler.emailMsgOpts.text;
                    let defaultServiceOpts = HttpErrorHandler.emailServiceOptions;
                    await HttpErrorHandler.mailService.sendEmail(err.handler.emailMsgOpts, err.handler.emailServiceOpts || defaultServiceOpts);
                }
                if (err.handler.sendText && (err.handler.textMsgOpts || HttpErrorHandler.textMsgOptions)) {
                    let textMsg = new TextMessage_1.TextMessage();
                    await textMsg.send(err, srcServer);
                }
                for (let ePoint of remoteEndpoints) {
                    await this._postToEndpoint(ePoint, reqOpts);
                }
                if (origin && _endpoint.length > remoteEndpoints.length) {
                    let lastPoint = _endpoint.filter(e => new url_1.URL(e).origin === origin);
                    if (lastPoint && lastPoint.length > 0) {
                        await this._postToEndpoint(lastPoint[0], reqOpts);
                    }
                }
            }
            return;
        }
        catch (err) {
            BBLogger_1.BBLogger.error(err);
            throw err;
        }
    }
    static hasHandler(err) {
        return (err && HttpError_1.HttpError.isHttpError(err) && err.handler instanceof HttpErrorHandler);
    }
}
exports.HttpErrorHandler = HttpErrorHandler;
//# sourceMappingURL=HttpErrorHandler.js.map