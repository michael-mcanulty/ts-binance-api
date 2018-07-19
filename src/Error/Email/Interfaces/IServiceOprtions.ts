import {ServiceProviders} from "../Enums/EServiceProviders";

export interface IEmailAuth {
	pass: string;
	user: string;
}

export interface IEmailOptions {
	auth: IEmailAuth;
	service: ServiceProviders;
}
