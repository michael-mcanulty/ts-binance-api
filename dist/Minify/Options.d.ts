import { IOptions } from "./Interfaces/IOptions";
export declare class Options implements IOptions {
    globs?: string[];
    ignore?: string[];
    includeBasePath?: boolean;
    directories?: boolean;
    callback: Function;
    static toOptions(opts: IOptions): Options;
    constructor(directories?: boolean, globs?: string[], ignore?: string[], includeBasePath?: boolean, callback?: Function);
}
