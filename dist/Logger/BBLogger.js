"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class BBLogger {
    constructor() {
    }
    static get Instance() {
        return this._INSTANCE || (this._INSTANCE = new this());
    }
    static _getAppName() {
        let appName = "";
        let pathArr = process.cwd().split(path.sep);
        let idxContains = BBLogger.indexContains(pathArr, "bb-");
        if (idxContains >= 0) {
            appName = pathArr[idxContains];
        }
        return appName;
    }
    static _getMsg(msg) {
        return `${BBLogger.utcToPST(new Date()).toISOString()} at ${BBLogger._getAppName()} \n ${msg} \r\n`;
    }
    static error(msg) {
        let logStream = fs.createWriteStream(BBLogger._errorStreamPath, { flags: 'a' });
        logStream.write(BBLogger._getMsg(msg), () => {
            logStream.close();
        });
    }
    static indexContains(arr, strContains) {
        let idx = -1;
        let hasSome = arr.some((item, index) => {
            idx = index;
            return (item.indexOf(strContains) >= 0);
        });
        return idx;
    }
    static info(msg) {
        let logStream = fs.createWriteStream(BBLogger._infoStreamPath, { flags: 'a' });
        logStream.write(BBLogger._getMsg(msg), () => {
            logStream.close();
        });
    }
    static utcToPST(date) {
        let _date = (date) ? date : new Date();
        return new Date(_date.getTime() - new Date().getTimezoneOffset() * 60000);
    }
    static warning(msg) {
        let logStream = fs.createWriteStream(BBLogger._warningStreamPath, { flags: 'a' });
        logStream.write(BBLogger._getMsg(msg), () => {
            logStream.close();
        });
    }
}
BBLogger._base = path.dirname(process.cwd());
BBLogger._dirBase = `${BBLogger._base}/${BBLogger._getAppName()}/logs/`;
BBLogger._errorStreamPath = `${BBLogger._dirBase}/error.txt`;
BBLogger._infoStreamPath = `${BBLogger._dirBase}/info.txt`;
BBLogger._warningStreamPath = `${BBLogger._dirBase}/warning.txt`;
exports.BBLogger = BBLogger;
//# sourceMappingURL=BBLogger.js.map