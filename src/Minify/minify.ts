import * as path from 'path';
import {Walk} from "./Walk";
import {IOptions} from "./Interfaces/IOptions";

export class Minify{
	public baseDir: string;
	public walk: Walk;
	public paths: string[];
	public scriptStr: string;

	public getFilePaths(): string[]{
		return this.walk.sync();
	}

	public getMinifyScript(files: string[]): string{
		let result: string = `terser `;
		files.forEach(t=>{
			result += `${t} `;
		});

		return `${result} --compress --mangle --keep-classnames --keep-fnames`;
	}

	constructor(){
		let opts: IOptions = <IOptions>{};
		let base: string = path.resolve('../../');
		this.baseDir = `${base}/dist`;
		let minifyDir: string = `${this.baseDir}/Minify`;
		opts.ignore = [minifyDir];
		opts.globs = ['*.ts'];
		this.walk = new Walk(this.baseDir, opts);
		this.paths = this.getFilePaths();
		this.scriptStr = this.getMinifyScript(this.paths);
		console.log(this.scriptStr);
	}
}

const minify = new Minify();