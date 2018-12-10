"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const path=require("path"),fs=require("fs"),Walk_1=require("./Walk");class Minify{getFilePaths(){return this.walk.sync()}getMinifyScript(e){let i=require("child_process").execSync;e.forEach(e=>{let s=`min/${e.split("/").slice(0,-1).join("/")}`;if(s&&!fs.existsSync(s))try{fs.mkdirSync(s)}catch(e){console.log(e)}if(s){i(`terser dist/${e} --compress --mangle --keep-classnames --keep-fnames --output min/${e}`)}})}constructor(){let e={},i=path.resolve("./");this.baseDir=`${i}/dist`;let s=`${this.baseDir}/Minify`;e.ignore=[s],e.globs=["*/**/*.js"],this.walk=new Walk_1.Walk(this.baseDir,e),this.paths=this.getFilePaths(),this.getMinifyScript(this.paths)}}exports.Minify=Minify;const minify=new Minify;