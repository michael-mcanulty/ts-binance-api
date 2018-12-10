"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Walk_1 = require("./Walk");
class Minify {
    getFilePaths() {
        return this.walk.sync();
    }
    getMinifyScript(files) {
        let cmd = require('child_process').execSync;
        files.forEach(t => {
            let dirs = t.split('/');
            let dir = "min" + "/" + dirs.slice(0, -1).join("/");
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let tmpRes = `terser dist/${t} --compress --mangle --keep-classnames --keep-fnames --output min/${t}`;
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