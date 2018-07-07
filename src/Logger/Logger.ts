import * as fs from "fs";
import {WriteStream} from "fs";
import * as path from "path";

export class Logger {
	private static _INSTANCE: Logger;
	private static _base: string = path.dirname(process.cwd());
	private static _dirBase: string = `${Logger._base}/${Logger._getAppName()}/logs/`;
	private static _errorStreamPath: string = `${Logger._dirBase}/error.txt`;
	private static _infoStreamPath: string = `${Logger._dirBase}/info.txt`;
	private static _warningStreamPath: string = `${Logger._dirBase}/warning.txt`;

	public static get Instance() {
		return this._INSTANCE || (this._INSTANCE = new this());
	}

	private static _getAppName(): string {
		let appName: string = "";
		let pathArr: string[] = process.cwd().split(path.sep);
		let idxContains: number = Logger.indexContains(pathArr, "bb-");
		if (idxContains >= 0) {
			appName = pathArr[idxContains];
		}
		return appName;
	}

	private static _getMsg(msg: string): string {
		return `${Logger.utcToPST(new Date()).toISOString()} at ${Logger._getAppName()} \n ${msg} \r\n`;
	}

	public static error(msg: string) {
		let logStream: WriteStream = fs.createWriteStream(Logger._errorStreamPath, {flags: 'a'});
		logStream.write(Logger._getMsg(msg), () => {
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
		let logStream: WriteStream = fs.createWriteStream(Logger._infoStreamPath, {flags: 'a'});
		logStream.write(Logger._getMsg(msg), () => {
			logStream.close();
		});
	}

	private static utcToPST(date?: Date) {
		let _date: Date = (date) ? date : new Date();
		return new Date(_date.getTime() - new Date().getTimezoneOffset() * 60000);
	}

	public static warning(msg: string) {
		let logStream: WriteStream = fs.createWriteStream(Logger._warningStreamPath, {flags: 'a'});
		logStream.write(Logger._getMsg(msg), () => {
			logStream.close();
		});
	}

	private constructor() {
	}
}