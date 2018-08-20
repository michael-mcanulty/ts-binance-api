import { IEmailAuth, IEmailOptions } from "./Interfaces/IServiceOprtions";
export declare class NodeMailerAuth {
    private _pass;
    pass: string;
    private _user;
    user: string;
    constructor(auth: IEmailAuth);
}
export declare class ServiceOptions {
    private _auth;
    auth: NodeMailerAuth;
    private _service;
    service: string;
    constructor(opts: IEmailOptions);
}
