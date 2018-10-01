import * as fs from "fs";
import * as path from "path";

export class BBLogger {
	private static _INSTANCE: BBLogger;
	private static _base: string = path.dirname(process.cwd());
	private static _dirBase: string = `${BBLogger._base}/${BBLogger._getAppName()}/logs`;
	public static lineLimit: number = 600;

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

	private static _getFilename(name: string) {
		return `${BBLogger._dirBase}/${name}.txt`;
	}

	private static _getMsg(msg: string): string {
		return `${BBLogger.utcToPST(new Date()).toISOString()} at ${BBLogger._getAppName()} \n ${msg} \r\n`;
	}

	private static async _writeToFile(filename: string, msg: string): Promise<void> {
		try {
			if (msg) {
				await BBLogger.limitedLines(filename);
				fs.appendFile(filename, BBLogger._getMsg(msg), err => {
					if (err) {
						throw err;
					} else {
						return;
					}
				});
			} else {
				return;
			}
		} catch (err) {
			throw err;
		}
	}

	public static async error(msg: string, plain: boolean = false): Promise<void> {
		try {
			let name: string = BBLogger.error.name;
			let filename: string = BBLogger._getFilename(name);
			let message: string = (plain) ? msg : BBLogger._getMsg(msg);
			BBLogger._writeToFile(filename, message);
			return;
		} catch (err) {
			throw err;
		}
	}

	public static indexContains(arr: string[], strContains: string): number {
		let idx: number = -1;
		let hasSome: boolean = arr.some((item: string, index: number) => {
			idx = index;
			return (item.indexOf(strContains) >= 0);
		});
		return idx;
	}

	public static async info(msg: string, plain: boolean = false): Promise<void> {
		try {
			let name: string = BBLogger.info.name;
			let filename: string = BBLogger._getFilename(name);
			let message: string = (plain) ? msg : BBLogger._getMsg(msg);
			BBLogger._writeToFile(filename, message);
			return;
		} catch (err) {
			throw err;
		}
	}

	private static async limitedLines(filename: string): Promise<void> {
		try {
			fs.readFile(filename, 'utf8', (err, data) => {
				if (err) {
					return Promise.reject(err);
				} else {
					let lines: string[] = data.split('\n');
					if (lines.length > BBLogger.lineLimit) {
						let diff: number = BBLogger.lineLimit - lines.length;
						fs.writeFile(filename, lines.slice(diff, lines.length - 1).join('\n'), err => {
							if (err) {
								throw err;
							} else {
								return;
							}
						});
					} else {
						return;
					}
				}
			});
		} catch (err) {
			throw err;
		}
	}

	private static utcToPST(date?: Date) {
		let _date: Date = (date) ? date : new Date();
		return new Date(_date.getTime() - new Date().getTimezoneOffset() * 60000);
	}

	public static async warning(msg: string, plain: boolean = false): Promise<void> {
		try {
			let name: string = BBLogger.warning.name;
			let filename: string = BBLogger._getFilename(name);
			let message: string = (plain) ? msg : BBLogger._getMsg(msg);
			BBLogger._writeToFile(filename, message);
			return;
		} catch (err) {
			throw err;
		}
	}

	private constructor() {
	}
}