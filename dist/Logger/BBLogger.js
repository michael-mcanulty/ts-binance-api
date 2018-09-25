"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class BBLogger {
    constructor() {
    }
    static _getFilename(name) {
        return `${BBLogger._dirBase}/${name}.txt`;
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
    static limitedLines(filename) {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(filename, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
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
                                    resolve();
                                }
                            });
                        }
                        else {
                            resolve();
                        }
                    }
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    static _writeToFile(filename, msg) {
        return new Promise(async (resolve, reject) => {
            try {
                if (msg) {
                    await BBLogger.limitedLines(filename);
                    fs.appendFile(filename, BBLogger._getMsg(msg), err => {
                        if (err) {
                            throw err;
                        }
                        else {
                            resolve();
                        }
                    });
                }
                else {
                    resolve();
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
    static info(msg) {
        return new Promise(async (resolve, reject) => {
            try {
                let name = BBLogger.info.name;
                let filename = BBLogger._getFilename(name);
                BBLogger._writeToFile(filename, BBLogger._getMsg(msg));
                resolve();
            }
            catch (err) {
                reject(err);
            }
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
    static error(msg) {
        return new Promise(async (resolve, reject) => {
            try {
                let name = BBLogger.error.name;
                let filename = BBLogger._getFilename(name);
                BBLogger._writeToFile(filename, BBLogger._getMsg(msg));
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    static utcToPST(date) {
        let _date = (date) ? date : new Date();
        return new Date(_date.getTime() - new Date().getTimezoneOffset() * 60000);
    }
    static warning(msg) {
        return new Promise(async (resolve, reject) => {
            try {
                let name = BBLogger.warning.name;
                let filename = BBLogger._getFilename(name);
                BBLogger._writeToFile(filename, BBLogger._getMsg(msg));
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
BBLogger.lineLimit = 100;
BBLogger._base = path.dirname(process.cwd());
BBLogger._dirBase = `${BBLogger._base}/${BBLogger._getAppName()}/logs`;
exports.BBLogger = BBLogger;
//# sourceMappingURL=BBLogger.js.map