"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const WebSocket=require("ws"),Events_1=require("./Events");class ReconnectingWebSocket{constructor(e,t={},s){this._connectLock=!1,this._listeners={error:[],message:[],open:[],close:[]},this._shouldReconnect=!0,this.eventToHandler=new Map([["open",this._handleOpen.bind(this)],["close",this._handleClose.bind(this)],["error",this._handleError.bind(this)],["message",this._handleMessage.bind(this)]]),this.onclose=void 0,this.onerror=void 0,this.onmessage=void 0,this.onopen=void 0,this._binaryType="blob",this._retryCount=-1,this._url=e,this._protocols=s,this._options=t,this._connect(),0===Object.keys(t).length?this._options={maxReconnectionDelay:1e4,minReconnectionDelay:1e3+4e3*Math.random(),minUptime:5e3,reconnectionDelayGrowFactor:1.3,connectionTimeout:4e3,maxRetries:1/0,debug:!1}:this._options=t}static get CLOSED(){return 3}get CLOSED(){return ReconnectingWebSocket.CLOSED}static get CLOSING(){return 2}get CLOSING(){return ReconnectingWebSocket.CLOSING}static get CONNECTING(){return 0}get CONNECTING(){return ReconnectingWebSocket.CONNECTING}static get OPEN(){return 1}get OPEN(){return ReconnectingWebSocket.OPEN}get binaryType(){return this._ws?this._ws.binaryType:this._binaryType}set binaryType(e){this._binaryType=e,this._ws&&(this._ws.binaryType=e)}get retryCount(){return Math.max(this._retryCount,0)}get bufferedAmount(){return this._ws?this._ws.bufferedAmount:0}get extensions(){return this._ws?this._ws.extensions:""}get protocol(){return this._ws?this._ws.protocol:""}get readyState(){return this._ws?this._ws.readyState:ReconnectingWebSocket.CONNECTING}get url(){return this._ws?this._ws.url:""}_acceptOpen(){this._retryCount=0}_addListeners(){this._debug("addListeners");for(const[e,t]of this.eventToHandler)this._ws.addEventListener(e,t)}_connect(){if(this._connectLock)return;this._connectLock=!0;const{maxRetries:e=this._options.maxRetries,connectionTimeout:t=this._options.connectionTimeout,WebSocket:s=ReconnectingWebSocket.getGlobalWebSocket()}=this._options;if(this._retryCount>=e)this._debug("max retries reached",this._retryCount,">=",e);else{if(this._retryCount++,this._debug("connect",this._retryCount),this._removeListeners(),!ReconnectingWebSocket.isWebSocket(s))throw Error("No valid BaseWebSocket class provided");this._wait().then(()=>this._getNextUrl(this._url)).then(e=>{this._debug("connect",{url:e,protocols:this._protocols}),this._ws=new s(e,this._protocols),this._ws.binaryType=this._binaryType,this._connectLock=!1,this._addListeners(),this._connectTimeout=setTimeout(()=>this._handleTimeout(),t)})}}_debug(...e){this._options.debug&&console.log("RWS>",...e)}_disconnect(e,t){if(clearTimeout(this._connectTimeout),this._ws){this._removeListeners();try{this._ws.close(e,t),this._handleClose(new Events_1.CloseEvent(e,t,this))}catch(e){}}}_getNextDelay(){let e=0;if(this._retryCount>0){const{reconnectionDelayGrowFactor:t=this._options.reconnectionDelayGrowFactor,minReconnectionDelay:s=this._options.minReconnectionDelay,maxReconnectionDelay:i=this._options.maxReconnectionDelay}=this._options;(e=s+Math.pow(this._retryCount-1,t))>i&&(e=i)}return this._debug("next delay",e),e}_getNextUrl(e){if("string"==typeof e)return Promise.resolve(e);if("function"==typeof e){const t=e();if("string"==typeof t)return Promise.resolve(t);if(this._isPromise(t))return t}throw Error("Invalid URL")}_handleClose(e){this._debug("close event"),this.onclose&&this.onclose(e),this._listeners.close.forEach(t=>t(e))}_handleError(e){this._debug("error event",e.message),this._disconnect(void 0,"TIMEOUT"===e.message?"timeout":void 0),this.onerror&&this.onerror(e),this._debug("exec error listeners"),this._listeners.error.forEach(t=>t(e)),this._connect()}_handleMessage(e){this._debug("message event"),this.onmessage&&this.onmessage(e),this._listeners.message.forEach(t=>t(e))}_handleOpen(e){this._debug("open event");const{minUptime:t=this._options.minUptime}=this._options;clearTimeout(this._connectTimeout),this._uptimeTimeout=setTimeout(()=>this._acceptOpen(),t),this._debug("assign binary type"),this._ws.binaryType=this._binaryType,this.onopen&&this.onopen(e),this._listeners.open.forEach(t=>t(e))}_handleTimeout(){this._debug("timeout event"),this._handleError(new Events_1.ErrorEvent(Error("TIMEOUT"),this))}_isPromise(e){return!!e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}_removeListeners(){if(this._ws){this._debug("removeListeners");for(const[e,t]of this.eventToHandler)this._ws.removeEventListener(e,t)}}_wait(){return new Promise(e=>{setTimeout(e,this._getNextDelay())})}addEventListener(e,t){this._listeners[e]&&this._listeners[e].push(t)}close(e,t){this._shouldReconnect=!1,this._ws&&this._ws.readyState!==this.CLOSED&&this._ws.close(e,t)}static getGlobalWebSocket(){if(void 0!==WebSocket)return WebSocket}static isWebSocket(e){return"function"==typeof e&&2===e.CLOSING}reconnect(e,t){this._shouldReconnect=!0,this._retryCount=-1,this._ws&&this._ws.readyState!==this.CLOSED||this._connect(),this._disconnect(e,t),this._connect()}removeEventListener(e,t){this._listeners[e]&&(this._listeners[e]=this._listeners[e].filter(e=>e!==t))}send(e){this._ws&&this._ws.send(e)}}exports.default=ReconnectingWebSocket;