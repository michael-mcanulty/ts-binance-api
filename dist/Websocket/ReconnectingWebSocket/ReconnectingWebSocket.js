"use strict";
/*!
 * Reconnecting BaseWebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */
Object.defineProperty(exports, "__esModule", {value: true});
const WebSocket = require('ws');
const Events_1 = require("./Events");
const getGlobalWebSocket = () => {
	if (typeof WebSocket !== 'undefined') {
		return WebSocket;
	}
};
const isWebSocket = (w) => typeof w === 'function' && w.CLOSING === 2;
const DEFAULT = {
	maxReconnectionDelay: 10000,
	minReconnectionDelay: 1000 + Math.random() * 4000,
	minUptime: 5000,
	reconnectionDelayGrowFactor: 1.3,
	connectionTimeout: 4000,
	maxRetries: Infinity,
	debug: false,
};

class ReconnectingWebSocket {
	constructor(url, protocols, options = {}) {
		this._connectLock = false;
		this._listeners = {
			error: [],
			message: [],
			open: [],
			close: [],
		};
		this._shouldReconnect = true;
		this.eventToHandler = new Map([
			['open', this._handleOpen.bind(this)],
			['close', this._handleClose.bind(this)],
			['error', this._handleError.bind(this)],
			['message', this._handleMessage.bind(this)],
		]);
		this.onclose = undefined;
		this.onerror = undefined;
		this.onmessage = undefined;
		this.onopen = undefined;
		this._binaryType = 'blob';
		this._retryCount = -1;
		this._url = url;
		this._protocols = protocols;
		this._options = options;
		this._connect();
	}

	static get CLOSED() {
		return 3;
	}

	static get CLOSING() {
		return 2;
	}

	static get CONNECTING() {
		return 0;
	}

	static get OPEN() {
		return 1;
	}

	get CLOSED() {
		return ReconnectingWebSocket.CLOSED;
	}

	get CLOSING() {
		return ReconnectingWebSocket.CLOSING;
	}

	get CONNECTING() {
		return ReconnectingWebSocket.CONNECTING;
	}

	get OPEN() {
		return ReconnectingWebSocket.OPEN;
	}

	get binaryType() {
		return this._ws ? this._ws.binaryType : this._binaryType;
	}

	set binaryType(value) {
		this._binaryType = value;
		if (this._ws) {
			this._ws.binaryType = value;
		}
	}

	get retryCount() {
		return Math.max(this._retryCount, 0);
	}

	get bufferedAmount() {
		return this._ws ? this._ws.bufferedAmount : 0;
	}

	get extensions() {
		return this._ws ? this._ws.extensions : '';
	}

	get protocol() {
		return this._ws ? this._ws.protocol : '';
	}

	get readyState() {
		return this._ws ? this._ws.readyState : ReconnectingWebSocket.CONNECTING;
	}

	get url() {
		return this._ws ? this._ws.url : '';
	}

	_acceptOpen() {
		this._retryCount = 0;
	}

	_addListeners() {
		this._debug('addListeners');
		for (const [type, handler] of this.eventToHandler) {
			this._ws.addEventListener(type, handler);
		}
	}

	_connect() {
		if (this._connectLock) {
			return;
		}
		this._connectLock = true;
		const {maxRetries = DEFAULT.maxRetries, connectionTimeout = DEFAULT.connectionTimeout, WebSocket = getGlobalWebSocket(),} = this._options;
		if (this._retryCount >= maxRetries) {
			this._debug('max retries reached', this._retryCount, '>=', maxRetries);
			return;
		}
		this._retryCount++;
		this._debug('connect', this._retryCount);
		this._removeListeners();
		if (!isWebSocket(WebSocket)) {
			throw Error('No valid BaseWebSocket class provided');
		}
		this._wait()
						.then(() => this._getNextUrl(this._url))
						.then(url => {
							this._debug('connect', {url, protocols: this._protocols});
							this._ws = new WebSocket(url, this._protocols);
							this._ws.binaryType = this._binaryType;
							this._connectLock = false;
							this._addListeners();
							this._connectTimeout = setTimeout(() => this._handleTimeout(), connectionTimeout);
						});
	}

	_debug(...params) {
		if (this._options.debug) {
			console.log('RWS>', ...params);
		}
	}

	_disconnect(code, reason) {
		clearTimeout(this._connectTimeout);
		if (!this._ws) {
			return;
		}
		this._removeListeners();
		try {
			this._ws.close(code, reason);
			this._handleClose(new Events_1.CloseEvent(code, reason, this));
		}
		catch (error) {
		}
	}

	_getNextDelay() {
		let delay = 0;
		if (this._retryCount > 0) {
			const {reconnectionDelayGrowFactor = DEFAULT.reconnectionDelayGrowFactor, minReconnectionDelay = DEFAULT.minReconnectionDelay, maxReconnectionDelay = DEFAULT.maxReconnectionDelay,} = this._options;
			delay =
							minReconnectionDelay + Math.pow(this._retryCount - 1, reconnectionDelayGrowFactor);
			if (delay > maxReconnectionDelay) {
				delay = maxReconnectionDelay;
			}
		}
		this._debug('next delay', delay);
		return delay;
	}

	_getNextUrl(urlProvider) {
		if (typeof urlProvider === 'string') {
			return Promise.resolve(urlProvider);
		}
		if (typeof urlProvider === 'function') {
			const url = urlProvider();
			if (typeof url === 'string') {
				return Promise.resolve(url);
			}
			if (this._isPromise(url)) {
				return url;
			}
		}
		throw Error('Invalid URL');
	}

	_handleClose(event) {
		this._debug('close event');
		if (this.onclose) {
			this.onclose(event);
		}
		this._listeners.close.forEach(listener => listener(event));
	}

	_handleError(event) {
		this._debug('error event', event.message);
		this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
		if (this.onerror) {
			this.onerror(event);
		}
		this._debug('exec error listeners');
		this._listeners.error.forEach(listener => listener(event));
		this._connect();
	}

	_handleMessage(event) {
		this._debug('message event');
		if (this.onmessage) {
			this.onmessage(event);
		}
		this._listeners.message.forEach(listener => listener(event));
	}

	_handleOpen(event) {
		this._debug('open event');
		const {minUptime = DEFAULT.minUptime} = this._options;
		clearTimeout(this._connectTimeout);
		this._uptimeTimeout = setTimeout(() => this._acceptOpen(), minUptime);
		this._debug('assign binary type');
		this._ws.binaryType = this._binaryType;
		if (this.onopen) {
			this.onopen(event);
		}
		this._listeners.open.forEach(listener => listener(event));
	}

	_handleTimeout() {
		this._debug('timeout event');
		this._handleError(new Events_1.ErrorEvent(Error('TIMEOUT'), this));
	}

	_isPromise(obj) {
		return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	}

	_removeListeners() {
		if (!this._ws) {
			return;
		}
		this._debug('removeListeners');
		for (const [type, handler] of this.eventToHandler) {
			this._ws.removeEventListener(type, handler);
		}
	}

	_wait() {
		return new Promise(resolve => {
			setTimeout(resolve, this._getNextDelay());
		});
	}

	addEventListener(type, listener) {
		if (this._listeners[type]) {
			this._listeners[type].push(listener);
		}
	}

	close(code, reason) {
		this._shouldReconnect = false;
		if (!this._ws || this._ws.readyState === this.CLOSED) {
			return;
		}
		this._ws.close(code, reason);
	}

	reconnect(code, reason) {
		this._shouldReconnect = true;
		this._retryCount = -1;
		if (!this._ws || this._ws.readyState === this.CLOSED) {
			this._connect();
		}
		this._disconnect(code, reason);
		this._connect();
	}

	removeEventListener(type, listener) {
		if (this._listeners[type]) {
			this._listeners[type] = this._listeners[type].filter(l => l !== listener);
		}
	}

	send(data) {
		if (this._ws) {
			this._ws.send(data);
		}
	}
}

exports.default = ReconnectingWebSocket;
//# sourceMappingURL=ReconnectingWebSocket.js.map