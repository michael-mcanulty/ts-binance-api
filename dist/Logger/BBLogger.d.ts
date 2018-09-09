export declare class BBLogger {
    static lineLimit: number;
    private static _INSTANCE;
    private static _base;
    private static _dirBase;
    private static _getFilename(name);
    static readonly Instance: BBLogger;
    private static _getAppName();
    private static _getMsg(msg);
    private static limitedLines(filename);
    private static _writeToFile(filename, msg);
    static info(msg: string): Promise<void>;
    static indexContains(arr: string[], strContains: string): number;
    static error(msg: string): Promise<void>;
    private static utcToPST(date?);
    static warning(msg: string): Promise<void>;
    private constructor();
}
