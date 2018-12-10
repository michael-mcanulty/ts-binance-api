import { IOptions } from "./Interfaces/IOptions";
import { Options } from "./Options";
export declare class Walk {
    baseDir: string;
    options: Options;
    private _fullpath;
    private _getStat;
    private _handleOptions;
    private _handleRelativePath;
    private _walkSync;
    entries(): any[];
    sync(): string[];
    constructor(baseDir: string, options?: IOptions);
}
