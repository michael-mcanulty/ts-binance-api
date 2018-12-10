"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Walk_1 = require("./Walk");
class Minify {
    getFilePaths() {
        return this.walk.sync();
    }
    getMinifyScript(files) {
        let result = `terser `;
        files.forEach(t => {
            result += `${t} `;
        });
        return `${result} --compress --mangle --keep-classnames --keep-fnames`;
    }
    constructor() {
        let opts = {};
        let base = path.resolve('../../');
        this.baseDir = `${base}/dist`;
        let minifyDir = `${this.baseDir}/Minify`;
        opts.ignore = [minifyDir];
        opts.globs = ['*.ts'];
        this.walk = new Walk_1.Walk(this.baseDir, opts);
    }
}
exports.Minify = Minify;
//# sourceMappingURL=minify.js.map