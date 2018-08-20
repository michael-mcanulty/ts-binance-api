import { Signed } from "./Signed";
import { IListenKey } from "./Interfaces/IListenKey";
export declare class DataStream extends Signed {
    listenKey: string;
    constructor(listenKey: IListenKey);
}
