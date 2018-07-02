import {ServiceProviders} from "./Enums/EServiceProviders";
import {IAuth, IServiceOptions} from "./Interfaces/IServiceOprtions";

export class Auth {
	private _pass: string;

	get pass(): string {
		return this._pass;
	}

	set pass(value: string) {
		this._pass = value;
	}

	private _user: string;

	get user(): string {
		return this._user;
	}

	set user(value: string) {
		this._user = value;
	}

	constructor(auth: IAuth) {
		this.user = auth.user;
		this.pass = auth.pass;
	}
}

export class ServiceOptions {
	private _auth: Auth;

	get auth(): Auth {
		return this._auth;
	}

	set auth(value: Auth) {
		this._auth = value;
	}

	private _service: string;

	set service(value: string) {
		this._service = value;
	}

	constructor(opts: IServiceOptions) {
		this.auth = new Auth(opts.auth);
		this.service = ServiceProviders[opts.service];
	}
}