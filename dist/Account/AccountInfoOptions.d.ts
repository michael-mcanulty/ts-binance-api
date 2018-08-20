import { Signed } from "../Rest/Signed";
import { IAccountInfoOptions } from "./Interfaces/IAccountInfoOptions";
export declare class AccountInfoOptions extends Signed implements IAccountInfoOptions {
    recvWindow?: number;
    constructor(recvWindow?: number);
}
