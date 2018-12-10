"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Walk_1 = require("./Walk");
class Minify {
    getFilePaths() {
        return this.walk.sync();
    }
    getMinifyScript(files) {
        let cmd = require('child_process').execSync;
        files.forEach(t => {
            let _preRes = t.valueOf().replace('.js', '.min.js');
            let tmpRes = `terser dist/${t} --compress --mangle --keep-classnames --keep-fnames --output dist/${_preRes}`;
            cmd(tmpRes);
        });
    }
    constructor() {
        let opts = {};
        let base = path.resolve('./');
        this.baseDir = `${base}/dist`;
        let minifyDir = `${this.baseDir}/Minify`;
        opts.ignore = [minifyDir];
        opts.globs = [`*/**/*.js`];
        this.walk = new Walk_1.Walk(this.baseDir, opts);
        this.paths = this.getFilePaths();
        this.getMinifyScript(this.paths);
    }
}
exports.Minify = Minify;
const minify = new Minify();
//# sourceMappingURL=minify.js.map