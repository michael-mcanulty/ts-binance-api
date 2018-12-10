import * as path from 'path';
import * as fs from 'fs';
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

	public getMinifyScript(files: string[]): void{
		let cmd = require('child_process').execSync;
		files.forEach(t=>{
			let dirs: string[] = t.split('/');
			let dir: string = "min" + "/" + dirs.slice(0,-1).join("/");
			if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}
			let tmpRes: string = `terser dist/${t} --compress --mangle --keep-classnames --keep-fnames --output min/${t}`;
			cmd(tmpRes);
		});
	}

	constructor(){
		let opts: IOptions = <IOptions>{};
		let base: string = path.resolve('./');
		this.baseDir = `${base}/dist`;
		let minifyDir: string = `${this.baseDir}/Minify`;
		opts.ignore = [minifyDir];
		opts.globs = [`*/**/*.js`];
		this.walk = new Walk(this.baseDir, opts);
		this.paths = this.getFilePaths();
		this.getMinifyScript(this.paths)
	}
}

const minify = new Minify();