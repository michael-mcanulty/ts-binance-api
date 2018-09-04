import { IEmailAuth } from "./IServiceOptions";
export interface ISMTPOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: IEmailAuth;
}
