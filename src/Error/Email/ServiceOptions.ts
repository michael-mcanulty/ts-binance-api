import {EServiceProviders} from "./Enums/EServiceProviders";
import {IEmailAuth, IServiceOptions} from "./Interfaces/IServiceOptions";

export class NodeMailerAuth {
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

	constructor(auth: IEmailAuth) {
		this.user = auth.user;
		this.pass = auth.pass;
	}
}

export class ServiceOptions {
	private _auth: NodeMailerAuth;

	get auth(): NodeMailerAuth {
		return this._auth;
	}

	set auth(value: NodeMailerAuth) {
		this._auth = value;
	}

	private _service: string;

	set service(value: string) {
		this._service = value;
	}

	constructor(opts: IServiceOptions) {
		if(opts && typeof opts.auth === "object" && typeof opts.service === "string"){
			this.auth = new NodeMailerAuth(opts.auth);
			this.service = EServiceProviders[opts.service];
		}
	}
}
