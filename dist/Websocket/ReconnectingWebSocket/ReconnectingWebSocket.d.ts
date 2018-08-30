/*!
 * Reconnecting BaseWebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */
import { CloseEvent, ErrorEvent, Event, WebSocketEventMap } from './Events';
export interface IReconOptions {
    WebSocket?: any;
    connectionTimeout?: number;
    debug?: boolean;
    maxReconnectionDelay?: number;
    maxRetries?: number;
    minReconnectionDelay?: number;
    minUptime?: number;
    reconnectionDelayGrowFactor?: number;
}
export declare type UrlProvider = string | (() => string) | (() => Promise<string>);
export declare type ListenersMap = {
    error: Array<((event: ErrorEvent) => void)>;
    message: Array<((event: MessageEvent) => void)>;
    open: Array<((event: Event) => void)>;
    close: Array<((event: CloseEvent) => void)>;
};
export default class ReconnectingWebSocket {
    private _connectLock;
    private _connectTimeout;
    private _listeners;
    private readonly _options;
    private readonly _protocols?;
    private _shouldReconnect;
    private _uptimeTimeout;
    private readonly _url;
    private _ws?;
    private readonly eventToHandler;
    onclose?: (event: CloseEvent) => void;
    onerror?: (event: Event) => void;
    onmessage?: (event: MessageEvent) => void;
    onopen?: (event: Event) => void;
    static readonly CLOSED: number;
    readonly CLOSED: number;
    static readonly CLOSING: number;
    readonly CLOSING: number;
    static readonly CONNECTING: number;
    readonly CONNECTING: number;
    static readonly OPEN: number;
    readonly OPEN: number;
    private _binaryType;
    binaryType: string;
    private _retryCount;
    readonly retryCount: number;
    readonly bufferedAmount: number;
    readonly extensions: string;
    readonly protocol: string;
    readonly readyState: number;
    readonly url: string;
    private _acceptOpen();
    private _addListeners();
    private _connect();
    private _debug(...params);
    private _disconnect(code?, reason?);
    private _getNextDelay();
    private _getNextUrl(urlProvider);
    private _handleClose(event);
    private _handleError(event);
    private _handleMessage(event);
    private _handleOpen(event);
    private _handleTimeout();
    private _isPromise(obj);
    private _removeListeners();
    private _wait();
    addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: ((event: WebSocketEventMap[K]) => void)): void;
    close(code?: number, reason?: string): void;
    private static getGlobalWebSocket();
    static isWebSocket(w: any): boolean;
    reconnect(code?: number, reason?: string): void;
    removeEventListener<K extends keyof WebSocketEventMap>(type: K, listener: ((event: WebSocketEventMap[K]) => void)): void;
    send(data: string | ArrayBuffer | Blob | ArrayBufferView): void;
    constructor(url: UrlProvider, options?: IReconOptions, protocols?: string | string[]);
}
