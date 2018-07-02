import {ServiceProviders} from "../Enums/EServiceProviders";

export interface IAuth {
	pass: string;
	user: string;
}

export interface IServiceOptions {
	auth: IAuth;
	service: ServiceProviders;
}
