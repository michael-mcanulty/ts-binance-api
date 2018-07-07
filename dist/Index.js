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
const WSBinance_1 = require("./Websocket/WSBinance");
const Auth_1 = require("./Account/Auth");
const BinanceRest_1 = require("./Rest/BinanceRest");
class BinanceApi {
    constructor(options) {
        BinanceApi.http = new BinanceRest_1.BinanceRest(options);
        BinanceApi.websocket = new WSBinance_1.WSBinance(options);
    }
}
exports.BinanceApi = BinanceApi;
let opts = {};
let auth = new Auth_1.Auth();
auth.key = "L0FS9RPqvB8prFcE1hQCTiowHYpWdq16X1eyFZURGOOjdnz1LfE5fbquf7qUQQgK";
auth.secret = "ANyASMoj6iMAYjvpgcVNLWvEToDBj6bco8NTqKJqzvml2vp4zHSKwajpqU2hSBiy";
opts.auth = auth;
opts.test = true;
opts.useServerTime;
const client = new BinanceApi(opts);
(() => __awaiter(this, void 0, void 0, function* () {
    let info = yield BinanceApi.http.getExchangeInfo();
    console.log(info);
}))();
//# sourceMappingURL=Index.js.map