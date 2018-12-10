"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Walk_1 = require("./Walk");
class Minify {
    static execute() {
        let minifyDir;
        let cmd = require('child_process').execSync;
        let opts = {};
        let base = path.resolve('./');
        let dirs = base.split("/");
        if (dirs.indexOf("dist") !== -1) {
            base = dirs.slice(0, -dirs.indexOf("dist")).join('/');
        }
        let distTest = `${base}/dist`;
        if (!fs.existsSync(distTest)) {
            let dirs = base.split("/");
            let nodeModIdx = dirs.indexOf("node_modules");
            if (nodeModIdx && nodeModIdx !== -1) {
                let dir = dirs.slice(0, -nodeModIdx).join('/');
                let distTest = `${dir}/dist`;
                if (dir && fs.existsSync(distTest)) {
                    base = dir;
                }
            }
        }
        Minify._baseDir = `${base}/dist`;
        minifyDir = `${Minify._baseDir}/Minify`;
        opts.ignore = [minifyDir];
        opts.globs = [`*/**/*.js`];
        Minify._walk = new Walk_1.Walk(Minify._baseDir, opts);
        Minify._paths = Minify._walk.sync();
        Minify._paths.forEach(t => {
            if (t) {
                cmd(`terser dist/${t} --compress --mangle --keep-classnames --keep-fnames --output dist/${t}`);
            }
        });
    }
}
exports.Minify = Minify;
//# sourceMappingURL=minify.js.map