export declare class Logger {
    private static _INSTANCE;
    private static _base;
    private static _dirBase;
    private static _errorStreamPath;
    private static _infoStreamPath;
    private static _warningStreamPath;
    static readonly Instance: Logger;
    private static _getAppName();
    private static _getMsg(msg);
    static error(msg: string): void;
    static indexContains(arr: string[], strContains: string): number;
    static info(msg: string): void;
    private static utcToPST(date?);
    static warning(msg: string): void;
    private constructor();
}
