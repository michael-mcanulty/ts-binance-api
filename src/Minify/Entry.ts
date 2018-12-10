import {IEntry} from "./Interfaces/IEntry";

export class Entry implements IEntry {
	relativePath: string;
	basePath: string;
	mode: number;
	size: number;
	mtime: number;

	public isDirectory() {
		return (this.mode & 61440) === 16384;
	}

	constructor(basePath: string, mode: number, mtime: number, relativePath: string, size: number) {
		this.basePath = basePath;
		this.mode = mode;
		this.mtime = mtime;
		this.relativePath = relativePath;
		this.size = size;
	}
}