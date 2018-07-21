"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EServiceProviders_1 = require("./Enums/EServiceProviders");
class NodeMailerAuth {
    get pass() {
        return this._pass;
    }
    set pass(value) {
        this._pass = value;
    }
    get user() {
        return this._user;
    }
    set user(value) {
        this._user = value;
    }
    constructor(auth) {
        this.user = auth.user;
        this.pass = auth.pass;
    }
}
exports.NodeMailerAuth = NodeMailerAuth;
class ServiceOptions {
    get auth() {
        return this._auth;
    }
    set auth(value) {
        this._auth = value;
    }
    set service(value) {
        this._service = value;
    }
    constructor(opts) {
        this.auth = new NodeMailerAuth(opts.auth);
        this.service = EServiceProviders_1.EServiceProviders[opts.service];
    }
}
exports.ServiceOptions = ServiceOptions;
//# sourceMappingURL=ServiceOptions.js.map