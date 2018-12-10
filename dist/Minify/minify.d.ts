import { Walk } from "./Walk";
export declare class Minify {
    baseDir: string;
    walk: Walk;
    paths: string[];
    scriptStr: string;
    getFilePaths(): string[];
    getMinifyScript(files: string[]): void;
    constructor();
}
