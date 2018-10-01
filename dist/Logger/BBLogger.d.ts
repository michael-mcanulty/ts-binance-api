export declare class BBLogger {
    private static _INSTANCE;
    private static _base;
    private static _dirBase;
    static lineLimit: number;
    static readonly Instance: BBLogger;
    private static _getAppName();
    private static _getFilename(name);
    private static _getMsg(msg);
    private static _writeToFile(filename, msg);
    static error(msg: string, plain?: boolean): Promise<void>;
    static indexContains(arr: string[], strContains: string): number;
    static info(msg: string, plain?: boolean): Promise<void>;
    private static limitedLines(filename);
    private static utcToPST(date?);
    static warning(msg: string, plain?: boolean): Promise<void>;
    private constructor();
}
