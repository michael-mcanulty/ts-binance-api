"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotHttp_1 = require("../Rest/BotHttp");
const NodeMailer_1 = require("./NodeMailer");
const BBLogger_1 = require("../Logger/BBLogger");
const HttpError_1 = require("./HttpError");
const url_1 = require("url");
const cluster_1 = require("cluster");
const TextMessage_1 = require("../TextMessage/TextMessage");
class HttpErrorHandler {
    constructor(handler) {
        this.restartSingleWorker = false;
        this.emailServiceOpts = HttpErrorHandler.emailServiceOptions;
        this.emailMsgOpts = (HttpErrorHandler.emailMsgOptions) ? HttpErrorHandler.emailMsgOptions : {};
        this.textMsgOpts = (HttpErrorHandler.textMsgOptions) ? HttpErrorHandler.textMsgOptions : {};
        if (handler) {
            if (handler.endpoint) {
                this.endpoint = (Array.isArray(handler.endpoint)) ? handler.endpoint : new Array(handler.endpoint);
            }
            this.method = handler.method;
            this.type = handler.type || 'Binance';
            this.sendEmail = handler.sendEmail;
            this.sendText = handler.sendText;
            this.payload = handler.payload;
            if (handler.emailServiceOpts && typeof handler.emailServiceOpts.auth === "object") {
                this.emailServiceOpts = handler.emailServiceOpts;
            }
            this.textMsgOpts = handler.textMsgOpts;
            this.emailMsgOpts = handler.emailMsgOpts;
        }
        if (!HttpErrorHandler.mailService && this.emailServiceOpts) {
            HttpErrorHandler.mailService = new NodeMailer_1.NodeMailer(this.emailServiceOpts);
            if (!HttpErrorHandler.textMsgService && this.textMsgOpts.carrier) {
                HttpErrorHandler.textMsgService = new TextMessage_1.TextMessage(this.textMsgOpts.carrier, this.emailServiceOpts);
            }
        }
    }
    async execute(err, srcUrl) {
        let reqOpts;
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
                let _error = HttpError_1.HttpError.toObjLiteral(err);
                let remoteEndpoints = [];
                let _endpoint;
                if (err.handler.method && err.handler.endpoint) {
                    this.payload = { error: _error };
                    _endpoint = (Array.isArray(err.handler.endpoint)) ? err.handler.endpoint : new Array(err.handler.endpoint);
                    remoteEndpoints = _endpoint;
                    if (origin && _endpoint.length > 1) {
                        remoteEndpoints = _endpoint.filter(e => new url_1.URL(e).origin !== origin);
                    }
                }
                reqOpts = {};
                reqOpts.method = err.handler.method;
                reqOpts.json = true;
                if (this.payload) {
                    reqOpts.body = this.payload;
                }
                if (err.handler.sendEmail && err.handler.emailMsgOpts && (err.handler.emailServiceOpts || HttpErrorHandler.emailServiceOptions)) {
                    err.handler.emailMsgOpts.subject = (!err.handler.emailMsgOpts.subject || err.handler.emailMsgOpts.subject.length === 0) ? `${_error.message} ${err.handler.type || "Unknown"} Error on the ${srcServer}` : err.handler.emailMsgOpts.subject;
                    err.handler.emailMsgOpts.text = (!err.handler.emailMsgOpts.text || err.handler.emailMsgOpts.text.length === 0) ? `Error code: ${_error.code} \n Message: ${_error.message} \n Stack: ${err.stack}` : err.handler.emailMsgOpts.text;
                    try {
                        await HttpErrorHandler.mailService.sendEmail(err.handler.emailMsgOpts);
                    }
                    catch (err) {
                        if (err && err.message) {
                            BBLogger_1.BBLogger.error(err.message);
                        }
                    }
                }
                if (err.handler.sendText && (err.handler.textMsgOpts || HttpErrorHandler.textMsgOptions)) {
                    try {
                        await HttpErrorHandler.textMsgService.sendError(err, err.handler.textMsgOpts.recipientPhone, origin);
                    }
                    catch (err) {
                        if (err && err.message) {
                            BBLogger_1.BBLogger.error(err.message);
                        }
                    }
                }
                for (let ePoint of remoteEndpoints) {
                    reqOpts.uri = ePoint;
                    try {
                        await BotHttp_1.BotHttp.requestApi(reqOpts);
                    }
                    catch (err) {
                        BBLogger_1.BBLogger.error(err.message);
                    }
                }
                if ((_endpoint && remoteEndpoints && origin) && (_endpoint.length > remoteEndpoints.length)) {
                    let lastPoint = _endpoint.filter(e => new url_1.URL(e).origin === origin);
                    if (lastPoint && lastPoint.length > 0) {
                        reqOpts.uri = lastPoint[0];
                        try {
                            await BotHttp_1.BotHttp.requestApi(reqOpts);
                        }
                        catch (err) {
                            BBLogger_1.BBLogger.error(err.message);
                        }
                    }
                }
            }
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