import {EServiceProviders} from "../Enums/EServiceProviders";

export interface IEmailAuth {
	pass: string;
	user: string;
}

export interface IServiceOptions {
	auth: IEmailAuth;
	service: EServiceProviders;
}
