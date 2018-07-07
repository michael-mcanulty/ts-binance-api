"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const fs = require("fs");
const path = require("path");
class Logger {
	constructor() {
	}

	static get Instance() {
		return this._INSTANCE || (this._INSTANCE = new this());
	}

	static _getAppName() {
		let appName = "";
		let pathArr = process.cwd().split(path.sep);
		let idxContains = Logger.indexContains(pathArr, "bb-");
		if (idxContains >= 0) {
			appName = pathArr[idxContains];
		}
		return appName;
	}

	static _getMsg(msg) {
		return `${Logger.utcToPST(new Date()).toISOString()} at ${Logger._getAppName()} \n ${msg} \r\n`;
	}

	static error(msg) {
		let logStream = fs.createWriteStream(Logger._errorStreamPath, {flags: 'a'});
		logStream.write(Logger._getMsg(msg), () => {
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
		let logStream = fs.createWriteStream(Logger._infoStreamPath, {flags: 'a'});
		logStream.write(Logger._getMsg(msg), () => {
			logStream.close();
		});
	}

	static utcToPST(date) {
		let _date = (date) ? date : new Date();
		return new Date(_date.getTime() - new Date().getTimezoneOffset() * 60000);
	}

	static warning(msg) {
		let logStream = fs.createWriteStream(Logger._warningStreamPath, {flags: 'a'});
		logStream.write(Logger._getMsg(msg), () => {
			logStream.close();
		});
	}
}
Logger._base = path.dirname(process.cwd());
Logger._dirBase = `${Logger._base}/${Logger._getAppName()}/logs/`;
Logger._errorStreamPath = `${Logger._dirBase}/error.txt`;
Logger._infoStreamPath = `${Logger._dirBase}/info.txt`;
Logger._warningStreamPath = `${Logger._dirBase}/warning.txt`;
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map