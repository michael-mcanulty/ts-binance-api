import * as fs from "fs";
import {WriteStream} from "fs";
import * as path from "path";

export class BBLogger {
	private static _INSTANCE: BBLogger;
	private static _base: string = path.dirname(process.cwd());
	private static _dirBase: string = `${BBLogger._base}/${BBLogger._getAppName()}/logs/`;
	private static _errorStreamPath: string = `${BBLogger._dirBase}/error.txt`;
	private static _infoStreamPath: string = `${BBLogger._dirBase}/info.txt`;
	private static _warningStreamPath: string = `${BBLogger._dirBase}/warning.txt`;

	public static get Instance() {
		return this._INSTANCE || (this._INSTANCE = new this());
	}

	private static _getAppName(): string {
		let appName: string = "";
		let pathArr: string[] = process.cwd().split(path.sep);
		let idxContains: number = BBLogger.indexContains(pathArr, "bb-");
		if (idxContains >= 0) {
			appName = pathArr[idxContains];
		}
		return appName;
	}

	private static _getMsg(msg: string): string {
		return `${BBLogger.utcToPST(new Date()).toISOString()} at ${BBLogger._getAppName()} \n ${msg} \r\n`;
	}

	public static error(msg: string) {
		let logStream: WriteStream = fs.createWriteStream(BBLogger._errorStreamPath, {flags: 'a'});
		logStream.write(BBLogger._getMsg(msg), () => {
			logStream.close();
		});
	}

	public static indexContains(arr: string[], strContains: string): number {
		let idx: number = -1;
		let hasSome: boolean = arr.some((item: string, index: number) => {
			idx = index;
			return (item.indexOf(strContains) >= 0);
		});
		return idx;
	}

	public static info(msg: string) {
		let logStream: WriteStream = fs.createWriteStream(BBLogger._infoStreamPath, {flags: 'a'});
		logStream.write(BBLogger._getMsg(msg), () => {
			logStream.close();
		});
	}

	private static utcToPST(date?: Date) {
		let _date: Date = (date) ? date : new Date();
		return new Date(_date.getTime() - new Date().getTimezoneOffset() * 60000);
	}

	public static warning(msg: string) {
		let logStream: WriteStream = fs.createWriteStream(BBLogger._warningStreamPath, {flags: 'a'});
		logStream.write(BBLogger._getMsg(msg), () => {
			logStream.close();
		});
	}

	private constructor() {
	}
}