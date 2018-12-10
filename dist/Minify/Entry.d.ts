import { IEntry } from "./Interfaces/IEntry";
export declare class Entry implements IEntry {
    relativePath: string;
    basePath: string;
    mode: number;
    size: number;
    mtime: number;
    isDirectory(): boolean;
    constructor(basePath: string, mode: number, mtime: number, relativePath: string, size: number);
}
