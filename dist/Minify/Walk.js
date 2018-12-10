"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const MatcherCollection = require("matcher-collection");
const ensurePosix = require("ensure-posix-path");
const Options_1 = require("./Options");
const Entry_1 = require("./Entry");
class Walk {
    _fullpath(relativePath) {
        return `${this.baseDir}/${relativePath}`;
    }
    _getStat(path) {
        let stat;
        try {
            stat = fs.statSync(path);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        return stat;
    }
    _handleOptions(_options) {
        let options;
        if (Array.isArray(_options)) {
            options = new Options_1.Options();
            options.globs = _options;
        }
        else if (_options) {
            options = Options_1.Options.toOptions(_options);
        }
        return options;
    }
    _handleRelativePath(_relativePath) {
        if (_relativePath == null) {
            return '';
        }
        else if (_relativePath.slice(-1) !== '/') {
            return _relativePath + '/';
        }
        else {
            return _relativePath;
        }
    }
    _walkSync(_relativePath, _ensurePosix, callback) {
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
                return new Entry_1.Entry(this.baseDir, stats.mode, stats.mtime.getTime(), entryRelativePath + '/', stats.size);
            }
            else {
                return new Entry_1.Entry(this.baseDir, stats.mode, stats.mtime.getTime(), entryRelativePath, stats.size);
            }
        }).filter(Boolean);
        let sortedEntries = entries.sort((a, b) => {
            let aPath = a.relativePath;
            let bPath = b.relativePath;
            if (aPath === bPath) {
                return 0;
            }
            else if (aPath < bPath) {
                return -1;
            }
            else {
                return 1;
            }
        });
        for (let i = 0; i < sortedEntries.length; ++i) {
            let entry = sortedEntries[i];
            if (entry.isDirectory()) {
                if (this.options.directories !== false && (!globMatcher || globMatcher.match(entry.relativePath))) {
                    if (this.options.callback) {
                        callback(entry);
                    }
                    results.push(entry);
                }
                results = results.concat(this._walkSync(entry.relativePath));
            }
            else {
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
    entries() {
        return this._walkSync(null, true);
    }
    ;
    sync() {
        let options = this.options;
        let mapFunct;
        if (options.includeBasePath) {
            mapFunct = (entry) => {
                return entry.basePath.split(path.sep).join('/') + '/' + entry.relativePath;
            };
        }
        else {
            mapFunct = (entry) => {
                return entry.relativePath;
            };
        }
        return this._walkSync().map(mapFunct);
    }
    constructor(baseDir, options) {
        this.baseDir = baseDir;
        this.options = this._handleOptions(options);
    }
}
exports.Walk = Walk;
//# sourceMappingURL=Walk.js.map