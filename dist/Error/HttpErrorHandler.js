"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotHttp_1 = require("../Rest/BotHttp");
const NodeMailer_1 = require("./NodeMailer");
const BBLogger_1 = require("../Logger/BBLogger");
const HttpError_1 = require("./HttpError");
const url_1 = require("url");
const cluster_1 = require("cluster");
const ECarrier_1 = require("../TextMessage/ECarrier");
const ErrorTextMessage_1 = require("./ErrorTextMessage");
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
            this.type = config.type || 'Binance';
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
                reqOpts = {};
                reqOpts.method = err.handler.method;
                reqOpts.headers = new Headers();
                reqOpts.headers.set("Content-Type", "application/json");
                reqOpts.json = true;
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
                    let textMsg = new ErrorTextMessage_1.ErrorTextMessage(ECarrier_1.ECarrier.TMobile, err.handler.textMsgOpts.recipientPhone, err.handler.emailServiceOpts);
                    await textMsg.sendError(err, origin);
                }
                for (let ePoint of remoteEndpoints) {
                    reqOpts.uri = ePoint;
                    await BotHttp_1.BotHttp.requestApi(reqOpts);
                }
                if (origin && _endpoint.length > remoteEndpoints.length) {
                    let lastPoint = _endpoint.filter(e => new url_1.URL(e).origin === origin);
                    if (lastPoint && lastPoint.length > 0) {
                        reqOpts.uri = lastPoint[0];
                        await BotHttp_1.BotHttp.requestApi(reqOpts);
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