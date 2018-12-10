import * as path from 'path';
import * as fs from 'fs';
import {Walk} from './Walk';
import {IOptions} from './Interfaces/IOptions';

export class Minify{
	private static _baseDir: string;
	private static _walk: Walk;
	private static _paths: string[];

	public static execute(): void{
		let minifyDir: string;
		let cmd = require('child_process').execSync;
		let opts: IOptions = <IOptions>{};
		let base: string = path.resolve('./');
		let dirs: string[] = base.split("/");
		if(dirs.indexOf("dist") !== -1){
			base = dirs.slice(0, -dirs.indexOf("dist")).join('/');
		}
		let distTest: string = `${base}/dist`;
		if(!fs.existsSync(distTest)){
			let dirs: string[] = base.split("/");
			let nodeModIdx: number = dirs.indexOf("node_modules");
			if(nodeModIdx && nodeModIdx !== -1){
				let dir: string = dirs.slice(0, -nodeModIdx).join('/');
				let distTest: string = `${dir}/dist`;
				if(dir && fs.existsSync(distTest)){
					base = dir;
				}
			}
		}
		Minify._baseDir = `${base}/dist`;
		minifyDir = `${Minify._baseDir}/Minify`;
		opts.ignore = [minifyDir];
		opts.globs = [`*.js`, `*/**/*.js`];
		Minify._walk = new Walk(Minify._baseDir, opts);
		Minify._paths = Minify._walk.sync();
		Minify._paths.forEach(t=>{
			if(t){
				cmd(`terser dist/${t} --compress --mangle --keep-classnames --keep-fnames --output dist/${t}`);
			}
		});
	}
}
