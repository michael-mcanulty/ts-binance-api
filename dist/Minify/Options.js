"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Options {
    static toOptions(opts) {
        return new Options(opts.directories, opts.globs, opts.ignore, opts.includeBasePath);
    }
    constructor(directories, globs, ignore, includeBasePath, callback) {
        this.directories = directories || true;
        this.globs = globs;
        this.ignore = ignore;
        this.includeBasePath = includeBasePath || false;
        this.callback = callback;
    }
}
exports.Options = Options;
//# sourceMappingURL=Options.js.map