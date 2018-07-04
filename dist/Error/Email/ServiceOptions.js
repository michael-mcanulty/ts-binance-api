"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const EServiceProviders_1 = require("./Enums/EServiceProviders");
class Auth {
	constructor(auth) {
		this.user = auth.user;
		this.pass = auth.pass;
	}

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
}
exports.Auth = Auth;
class ServiceOptions {
	constructor(opts) {
		this.auth = new Auth(opts.auth);
		this.service = EServiceProviders_1.ServiceProviders[opts.service];
	}

	get auth() {
		return this._auth;
	}

	set auth(value) {
		this._auth = value;
	}

	set service(value) {
		this._service = value;
	}
}
exports.ServiceOptions = ServiceOptions;
//# sourceMappingURL=ServiceOptions.js.map