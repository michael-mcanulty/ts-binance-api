import {IOptions} from "./Interfaces/IOptions";

export class Options implements IOptions{
	globs?: string[];
	ignore?: string[];
	includeBasePath?: boolean;
	directories?: boolean;
	callback: Function;

	public static toOptions(opts: IOptions): Options {
		return new Options(opts.directories, opts.globs, opts.ignore, opts.includeBasePath);
	}

	constructor(directories?: boolean, globs?: string[], ignore?: string[], includeBasePath?: boolean, callback?: Function) {
		this.directories = directories || true;
		this.globs = globs;
		this.ignore = ignore;
		this.includeBasePath = includeBasePath || false;
		this.callback = callback;
	}
}
