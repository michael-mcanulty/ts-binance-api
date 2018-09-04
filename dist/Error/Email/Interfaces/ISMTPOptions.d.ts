import { IEmailAuth } from "../../../Error/Email/Interfaces/IEmailAuth";
export interface ISMTPOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: IEmailAuth;
}
