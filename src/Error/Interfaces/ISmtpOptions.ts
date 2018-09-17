import {IEmailAuth} from "./IEmailAuth";

export interface ISmtpOptions {
	host: string;
	port: number;
	secure: boolean;
	auth: IEmailAuth
}