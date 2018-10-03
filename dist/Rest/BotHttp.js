"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const HttpError_1 = require("../Error/HttpError");
const Signed_1 = require("./Signed");
const ApiHeader_1 = require("./ApiHeader");
const CallOptions_1 = require("./CallOptions");
const requestPromise = require("request-promise-native");
class BotHttp {
    constructor(options) {
        this.options = options;
    }
    static buildUrl(options) {
        return `${BotHttp.BASE}${options.uri.includes('/wapi') ? '' : '/api'}${options.uri}${(options.qs instanceof Object) ? '' : BotHttp.makeQueryString(options.qs)}`;
    }
    async call(callOptions) {
        let result;
        try {
            result = await this.binanceRequest(callOptions);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
    async binanceRequest(callOptions) {
        let res;
        let requestOpts = {};
        requestOpts.uri = callOptions.uri;
        requestOpts.method = callOptions.method;
        requestOpts.headers = callOptions.headers;
        requestOpts.json = callOptions.json;
        try {
            res = await BotHttp.requestApi(requestOpts);
            return res;
        }
        catch (err) {
            throw err;
        }
    }
    static async requestApi(coreOptions) {
        let error;
        let requestApi;
        requestApi = requestPromise[coreOptions.method.toLowerCase()];
        let res = await requestApi(coreOptions);
        let json = await res.toJSON();
        if (res.statusCode !== 200) {
            error = new HttpError_1.HttpError(res.statusCode, res.statusMessage);
            return Promise.reject(error);
        }
        else {
            return json;
        }
    }
    getSignature(payload, timestamp) {
        let signature;
        signature = crypto.createHmac('sha256', this.options.auth.secret).update(BotHttp.makeQueryString(Object.assign(payload, timestamp)).substr(1)).digest('hex');
        return signature;
    }
    async getTimestamp() {
        let time = {};
        if (this.options.useServerTime) {
            try {
                time.timestamp = await this.timestamp();
                return time;
            }
            catch (err) {
                throw err;
            }
        }
        else {
            time.timestamp = Date.now();
            return time;
        }
    }
    static makeQueryString(params) {
        let result;
        let keys;
        keys = Object.keys(params).filter(k => params[k]);
        if (!params) {
            result = "";
        }
        else {
            result = `?${keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')}`;
        }
        return result;
    }
    async ping() {
        let config;
        let options = {};
        options.method = "GET";
        options.json = true;
        options.isSigned = true;
        options.uri = '/v1/ping';
        options.apiKey = this.options.auth.key;
        try {
            config = new CallOptions_1.CallOptions(options);
            await this.call(config);
            return true;
        }
        catch (err) {
            throw err;
        }
    }
    async privateCall(options) {
        let tStamp;
        let result;
        let signature;
        try {
            tStamp = await this.getTimestamp();
            options.headers = new ApiHeader_1.ApiHeader(this.options.auth.key);
            signature = await this.getSignature(options.qs, tStamp);
            if (options.isSigned) {
                if (typeof options.qs == undefined) {
                    options.qs = new Signed_1.Signed();
                }
                options.qs['timestamp'] = tStamp.timestamp;
                options.qs['signature'] = signature;
            }
            else {
                delete options.qs['timestamp'];
            }
            result = await this.binanceRequest(options);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
    async time() {
        let opts;
        let options = {};
        try {
            options.method = "GET";
            options.json = true;
            options.isSigned = true;
            options.apiKey = this.options.auth.key;
            options.uri = '/v1/time';
            opts = new CallOptions_1.CallOptions(options);
            return await this.call(opts);
        }
        catch (err) {
            throw err;
        }
    }
    async timestamp() {
        try {
            let time = await this.time();
            return time.serverTime;
        }
        catch (err) {
            throw err;
        }
    }
}
BotHttp.BASE = 'https://api.binance.com';
exports.BotHttp = BotHttp;
//# sourceMappingURL=BotHttp.js.map