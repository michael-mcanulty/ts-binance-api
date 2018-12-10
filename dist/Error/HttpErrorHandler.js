"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const BotHttp_1=require("../Rest/BotHttp"),NodeMailer_1=require("./NodeMailer"),BBLogger_1=require("../Logger/BBLogger"),HttpError_1=require("./HttpError"),url_1=require("url"),cluster_1=require("cluster"),TextMessage_1=require("../TextMessage/TextMessage");class HttpErrorHandler{constructor(e){this.restartSingleWorker=!1,this.emailServiceOpts=HttpErrorHandler.emailServiceOptions,this.emailMsgOpts=HttpErrorHandler.emailMsgOptions?HttpErrorHandler.emailMsgOptions:{},this.textMsgOpts=HttpErrorHandler.textMsgOptions?HttpErrorHandler.textMsgOptions:{},e&&(e.endpoint&&(this.endpoint=Array.isArray(e.endpoint)?e.endpoint:new Array(e.endpoint)),this.method=e.method,this.type=e.type||"Binance",this.sendEmail=e.sendEmail,this.sendText=e.sendText,this.payload=e.payload,e.emailServiceOpts&&"object"==typeof e.emailServiceOpts.auth&&(this.emailServiceOpts=e.emailServiceOpts),this.textMsgOpts=e.textMsgOpts,this.emailMsgOpts=e.emailMsgOpts),!HttpErrorHandler.mailService&&this.emailServiceOpts&&(HttpErrorHandler.mailService=new NodeMailer_1.NodeMailer(this.emailServiceOpts),!HttpErrorHandler.textMsgService&&this.textMsgOpts.carrier&&(HttpErrorHandler.textMsgService=new TextMessage_1.TextMessage(this.textMsgOpts.carrier,this.emailServiceOpts)))}async execute(e,r){let t;try{let s=r.origin,a="1"==r.port.charAt(-1)?"Data Server":"Analysis Server";if(e&&HttpErrorHandler.hasHandler(e)){this.restartSingleWorker&&(this.payload.id=cluster_1.worker.id),e.handler.emailMsgOpts&&(e.handler.emailMsgOpts=HttpErrorHandler.emailMsgOptions),e.handler.emailServiceOpts&&e.handler.emailServiceOpts.auth||(e.handler.emailServiceOpts=HttpErrorHandler.emailServiceOptions);let r,i=HttpError_1.HttpError.toObjLiteral(e),l=[];if(e.handler.method&&e.handler.endpoint&&(this.payload={error:i},l=r=Array.isArray(e.handler.endpoint)?e.handler.endpoint:new Array(e.handler.endpoint),s&&r.length>1&&(l=r.filter(e=>new url_1.URL(e).origin!==s))),(t={}).method=e.handler.method,t.json=!0,this.payload&&(t.body=this.payload),e.handler.sendEmail&&e.handler.emailMsgOpts&&(e.handler.emailServiceOpts||HttpErrorHandler.emailServiceOptions)){e.handler.emailMsgOpts.subject=e.handler.emailMsgOpts.subject&&0!==e.handler.emailMsgOpts.subject.length?e.handler.emailMsgOpts.subject:`${i.message} ${e.handler.type||"Unknown"} Error on the ${a}`,e.handler.emailMsgOpts.text=e.handler.emailMsgOpts.text&&0!==e.handler.emailMsgOpts.text.length?e.handler.emailMsgOpts.text:`Error code: ${i.code} \n Message: ${i.message} \n Stack: ${e.stack}`;try{await HttpErrorHandler.mailService.sendEmail(e.handler.emailMsgOpts)}catch(e){e&&e.message&&BBLogger_1.BBLogger.error(e.message)}}if(e.handler.sendText&&(e.handler.textMsgOpts||HttpErrorHandler.textMsgOptions))try{await HttpErrorHandler.textMsgService.sendError(e,e.handler.textMsgOpts.recipientPhone,s)}catch(e){e&&e.message&&BBLogger_1.BBLogger.error(e.message)}for(let r of l){t.uri=r;try{await BotHttp_1.BotHttp.requestApi(t)}catch(e){BBLogger_1.BBLogger.error(e.message)}}if(r&&l&&s&&r.length>l.length){let a=r.filter(e=>new url_1.URL(e).origin===s);if(a&&a.length>0){t.uri=a[0];try{await BotHttp_1.BotHttp.requestApi(t)}catch(e){BBLogger_1.BBLogger.error(e.message)}}}}}catch(e){throw BBLogger_1.BBLogger.error(e),e}}static hasHandler(e){return e&&HttpError_1.HttpError.isHttpError(e)&&e.handler instanceof HttpErrorHandler}}exports.HttpErrorHandler=HttpErrorHandler;