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
    static _getFilename(name) {
        return `${BBLogger._dirBase}/${name}.txt`;
    }
    static _getMsg(msg) {
        return `${BBLogger.utcToPST(new Date()).toISOString()} at ${BBLogger._getAppName()} \n ${msg} \r\n`;
    }
    static async _writeToFile(filename, msg) {
        try {
            if (msg) {
                await BBLogger.limitedLines(filename);
                fs.appendFile(filename, BBLogger._getMsg(msg), err => {
                    if (err) {
                        throw err;
                    }
                    else {
                        return;
                    }
                });
            }
            else {
                return;
            }
        }
        catch (err) {
            throw err;
        }
    }
    static async error(msg, plain = false) {
        try {
            let name = BBLogger.error.name;
            let filename = BBLogger._getFilename(name);
            let message = (plain) ? msg : BBLogger._getMsg(msg);
            BBLogger._writeToFile(filename, message);
            return;
        }
        catch (err) {
            throw err;
        }
    }
    static indexContains(arr, strContains) {
        let idx = -1;
        let hasSome = arr.some((item, index) => {
            idx = index;
            return (item.indexOf(strContains) >= 0);
        });
        return idx;
    }
    static async info(msg, plain = false) {
        try {
            let name = BBLogger.info.name;
            let filename = BBLogger._getFilename(name);
            let message = (plain) ? msg : BBLogger._getMsg(msg);
            BBLogger._writeToFile(filename, message);
            return;
        }
        catch (err) {
            throw err;
        }
    }
    static async limitedLines(filename) {
        try {
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    return Promise.reject(err);
                }
                else {
                    let lines = data.split('\n');
                    if (lines.length > BBLogger.lineLimit) {
                        let diff = BBLogger.lineLimit - lines.length;
                        fs.writeFile(filename, lines.slice(diff, lines.length - 1).join('\n'), err => {
                            if (err) {
                                throw err;
                            }
                            else {
                                return;
                            }
                        });
                    }
                    else {
                        return;
                    }
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
    static utcToPST(date) {
        let _date = (date) ? date : new Date();
        return new Date(_date.getTime() - new Date().getTimezoneOffset() * 60000);
    }
    static async warning(msg, plain = false) {
        try {
            let name = BBLogger.warning.name;
            let filename = BBLogger._getFilename(name);
            let message = (plain) ? msg : BBLogger._getMsg(msg);
            BBLogger._writeToFile(filename, message);
            return;
        }
        catch (err) {
            throw err;
        }
    }
}
BBLogger._base = path.dirname(process.cwd());
BBLogger._dirBase = `${BBLogger._base}/${BBLogger._getAppName()}/logs`;
BBLogger.lineLimit = 600;
exports.BBLogger = BBLogger;
//# sourceMappingURL=BBLogger.js.map