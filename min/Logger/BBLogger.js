"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const fs=require("fs"),path=require("path");class BBLogger{constructor(){}static get Instance(){return this._INSTANCE||(this._INSTANCE=new this)}static _getAppName(){let e="",t=process.cwd().split(path.sep),r=BBLogger.indexContains(t,"bb-");return r>=0&&(e=t[r]),e}static _getFilename(e){return`${BBLogger._dirBase}/${e}.txt`}static _getMsg(e){return`${BBLogger.utcToPST(new Date).toISOString()} at ${BBLogger._getAppName()} \n ${e} \r\n`}static async _writeToFile(e,t){try{if(!t)return;await BBLogger.limitedLines(e),fs.appendFile(e,BBLogger._getMsg(t),e=>{if(e)throw e})}catch(e){throw e}}static async error(e,t=!1){try{let r=BBLogger.error.name,g=BBLogger._getFilename(r),i=t?e:BBLogger._getMsg(e);return void BBLogger._writeToFile(g,i)}catch(e){throw e}}static indexContains(e,t){let r=-1;e.some((e,g)=>(r=g,e.indexOf(t)>=0));return r}static async info(e,t=!1){try{let r=BBLogger.info.name,g=BBLogger._getFilename(r),i=t?e:BBLogger._getMsg(e);return void BBLogger._writeToFile(g,i)}catch(e){throw e}}static async limitedLines(e){try{fs.readFile(e,"utf8",(t,r)=>{if(t)return Promise.reject(t);{let t=r.split("\n");if(!(t.length>BBLogger.lineLimit))return;{let r=BBLogger.lineLimit-t.length;fs.writeFile(e,t.slice(r,t.length-1).join("\n"),e=>{if(e)throw e})}}})}catch(e){throw e}}static utcToPST(e){let t=e||new Date;return new Date(t.getTime()-6e4*(new Date).getTimezoneOffset())}static async warning(e,t=!1){try{let r=BBLogger.warning.name,g=BBLogger._getFilename(r),i=t?e:BBLogger._getMsg(e);return void BBLogger._writeToFile(g,i)}catch(e){throw e}}}BBLogger._base=path.dirname(process.cwd()),BBLogger._dirBase=`${BBLogger._base}/${BBLogger._getAppName()}/logs`,BBLogger.lineLimit=600,exports.BBLogger=BBLogger;