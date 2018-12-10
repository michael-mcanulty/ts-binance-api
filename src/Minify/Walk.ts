import {IOptions} from "./Interfaces/IOptions";
import * as fs from "fs";
import {Stats} from "fs";
import * as path from "path";
import MatcherCollection from 'matcher-collection';
import ensurePosix from 'ensure-posix-path';
import {Options} from "./Options";
import {Entry} from "./Entry";


export class Walk {
	public baseDir: string;
	public options: Options;

	private _fullpath(relativePath: string): string {
		return `${this.baseDir}/${relativePath}`;
	}

	private _getStat(path): Stats {
		let stat: Stats;

		try {
			stat = fs.statSync(path);
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error;
			}
		}

		return stat;
	}

	private _handleOptions(_options?: IOptions): Options {
		let options: Options;
		if (Array.isArray(_options)) {
			options = new Options();
			options.globs = _options;
		} else if (_options) {
			options = Options.toOptions(_options);
		}
		return options;
	}

	private _handleRelativePath(_relativePath: string) {
		if (_relativePath == null) {
			return '';
		} else if (_relativePath.slice(-1) !== '/') {
			return _relativePath + '/';
		} else {
			return _relativePath;
		}
	}

	private _walkSync(_relativePath?: string, _ensurePosix?: boolean, callback?: Function) {
		if (_ensurePosix) {
			this.baseDir = ensurePosix(this.baseDir);
		}
		let relativePath = this._handleRelativePath(_relativePath);
		let globs = this.options.globs;
		let ignorePatterns = this.options.ignore;
		let globMatcher, ignoreMatcher;
		let results = [];

		if (ignorePatterns) {
			ignoreMatcher = new MatcherCollection(ignorePatterns);
		}

		if (globs) {
			globMatcher = new MatcherCollection(globs);
		}

		if (globMatcher && !globMatcher.mayContain(relativePath)) {
			return results;
		}

		let names = fs.readdirSync(this._fullpath(relativePath));
		let entries = names.map(name => {
			let entryRelativePath = relativePath + name;

			if (ignoreMatcher && ignoreMatcher.match(entryRelativePath)) {
				return;
			}

			let fullPath = this._fullpath(entryRelativePath);
			let stats = this._getStat(fullPath);

			if (stats && stats.isDirectory()) {
				//basePath: string, mode: number, mtime: number, relativePath: string, size: number
				return new Entry(this.baseDir, stats.mode, stats.mtime.getTime(), entryRelativePath + '/', stats.size);
			} else {
				return new Entry(this.baseDir, stats.mode, stats.mtime.getTime(), entryRelativePath, stats.size);
			}
		}).filter(Boolean);

		let sortedEntries = entries.sort((a, b) => {
			let aPath = a.relativePath;
			let bPath = b.relativePath;

			if (aPath === bPath) {
				return 0;
			} else if (aPath < bPath) {
				return -1;
			} else {
				return 1;
			}
		});

		for (let i = 0; i < sortedEntries.length; ++i) {
			let entry: Entry = sortedEntries[i];

			if (entry.isDirectory()) {
				if (this.options.directories !== false && (!globMatcher || globMatcher.match(entry.relativePath))) {
					if (this.options.callback) {
						callback(entry);
					}
					results.push(entry);
				}
				results = results.concat(this._walkSync(entry.relativePath));
			} else {
				if (!globMatcher || globMatcher.match(entry.relativePath)) {
					if (this.options.callback) {
						callback(entry);
					}
					results.push(entry);
				}
			}
		}

		return results;
	}

	public entries() {
		return this._walkSync(null, true);
	};

	public sync(): string[]{
		let options: Options = this.options;
		let mapFunct;
		if (options.includeBasePath) {
			mapFunct = (entry: Entry): string => {
				return entry.basePath.split(path.sep).join('/') + '/' + entry.relativePath;
			}
		} else {
			mapFunct = (entry: Entry): string => {
				return entry.relativePath;
			}
		}

		return this._walkSync().map(mapFunct);
	}

	constructor(baseDir: string, options?: IOptions) {
		this.baseDir = baseDir;
		this.options = this._handleOptions(options);
	}
}