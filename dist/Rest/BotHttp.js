"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fetch = require("isomorphic-fetch");
const crypto = require("crypto");
const HttpError_1 = require("../Error/HttpError");
const EMethod_1 = require("./EMethod");
const Signed_1 = require("./Signed");
const ApiHeader_1 = require("./ApiHeader");
const CallOptions_1 = require("./CallOptions");
class BotHttp {
    constructor(options) {
        this.options = options;
    }
    static buildUrl(path, noData, data) {
        return `${BotHttp.BASE}${path.includes('/wapi') ? '' : '/api'}${path}${noData ? '' : BotHttp.makeQueryString(data)}`;
    }
    call(path, callOptions, payload) {
        return new Promise(async (resolve, reject) => {
            let result;
            try {
                result = await this.fetch(path, callOptions, payload);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    fetch(path, callOptions, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = BotHttp.buildUrl(path, callOptions.noData, payload);
                let res = await BotHttp.fetch(url, callOptions);
                let json = await res.json();
                if (res.ok === false) {
                    let error = new HttpError_1.HttpError(parseInt(res.status.toString()), res.statusText);
                    reject(error);
                }
                else {
                    resolve(json);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getSignature(payload, timestamp) {
        let signature = crypto.createHmac('sha256', this.options.auth.secret).update(BotHttp.makeQueryString(Object.assign(payload, timestamp)).substr(1)).digest('hex');
        return signature;
    }
    getTimestamp() {
        return new Promise(async (resolve, reject) => {
            let time = {};
            if (this.options.useServerTime) {
                try {
                    time.timestamp = await this.timestamp();
                    resolve(time);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                time.timestamp = Date.now();
                resolve(time);
            }
        });
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
    ping() {
        return new Promise(async (resolve, reject) => {
            try {
                let opts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
                await this.call('/v1/ping', opts);
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    privateCall(path, callOptions, payload) {
        return new Promise(async (resolve, reject) => {
            let result;
            let signature;
            if (!payload) {
                payload = new Signed_1.Signed();
            }
            try {
                let tStamp = await this.getTimestamp();
                callOptions.headers = new ApiHeader_1.ApiHeader(this.options.auth.key);
                signature = await this.getSignature(payload, tStamp);
                if (!callOptions.noExtra) {
                    payload.timestamp = tStamp.timestamp;
                    payload.signature = signature;
                }
                else {
                    delete payload.timestamp;
                }
                result = await this.fetch(path, callOptions, payload);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    time() {
        return new Promise(async (resolve, reject) => {
            try {
                let opts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
                let server = await this.call('/v1/time', opts);
                resolve(server);
            }
            catch (err) {
                reject(`Error in server time sync. Message: ${err}`);
            }
        });
    }
    timestamp() {
        return new Promise(async (resolve, reject) => {
            try {
                let time = await this.time();
                resolve(time.serverTime);
            }
            catch (err) {
                reject(`Error in server time sync. Message: ${err}`);
            }
        });
    }
}
BotHttp.BASE = 'https://api.binance.com';
BotHttp.fetch = Fetch;
exports.BotHttp = BotHttp;
//# sourceMappingURL=BotHttp.js.map