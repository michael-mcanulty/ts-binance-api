import * as fs from "fs";
import * as path from "path";

export class BBLogger {
	public static lineLimit: number= 600;
	private static _INSTANCE: BBLogger;
	private static _base: string = path.dirname(process.cwd());
	private static _dirBase: string = `${BBLogger._base}/${BBLogger._getAppName()}/logs`;
	private static _getFilename(name: string){
		return `${BBLogger._dirBase}/${name}.txt`;
	}

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

	private static limitedLines(filename: string): Promise<void>{
		return new Promise((resolve, reject)=> {
			try {
				fs.readFile(filename, 'utf8', (err, data)=>{
					if (err){
					reject(err);
				}else{
					let lines: string[] = data.split('\n');
					if(lines.length > BBLogger.lineLimit){
						let diff: number = BBLogger.lineLimit - lines.length;
						fs.writeFile(filename, lines.slice(diff, lines.length -1).join('\n'), err=>{
							if (err){
								throw err;
							}else{
								resolve();
							}
						});
					}else{
						resolve();
					}
				}
				});
			} catch (err) {
				reject(err);
			}
		});

	}

	private static _writeToFile(filename: string, msg: string): Promise<void>{
		return new Promise(async (resolve, reject)=>{
			try{
				if(msg){
					await BBLogger.limitedLines(filename);
					fs.appendFile(filename, BBLogger._getMsg(msg), err=>{
						if (err){
							throw err;
						}else{
							resolve();
						}
					});
				}else{
					resolve();
				}
			}catch(err){
				reject(err);
			}
		})
	}

	public static info(msg: string): Promise<void>{
		return new Promise(async (resolve, reject)=> {
			try{
				let name: string = BBLogger.info.name;
				let filename: string = BBLogger._getFilename(name);
				BBLogger._writeToFile(filename, BBLogger._getMsg(msg));
				resolve();
			}catch(err){
				reject(err);
			}
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

	public static error(msg: string): Promise<void>{
		return new Promise(async (resolve, reject)=> {
			try{
				let name: string = BBLogger.error.name;
				let filename: string = BBLogger._getFilename(name);
				BBLogger._writeToFile(filename, BBLogger._getMsg(msg));
				resolve();
			}catch(err){
				reject(err);
			}
		});
	}

	private static utcToPST(date?: Date) {
		let _date: Date = (date) ? date : new Date();
		return new Date(_date.getTime() - new Date().getTimezoneOffset() * 60000);
	}

	public static warning(msg: string): Promise<void>{
		return new Promise(async (resolve, reject)=> {
			try{
				let name: string = BBLogger.warning.name;
				let filename: string = BBLogger._getFilename(name);
				BBLogger._writeToFile(filename, BBLogger._getMsg(msg));
				resolve();
			}catch(err){
				reject(err);
			}
		});
	}

	private constructor() {
	}
}