export declare class Event {
    target: any;
    type: string;
    constructor(type: string, target: any);
}
export declare class ErrorEvent extends Event {
    error: Error;
    message: string;
    constructor(error: Error, target: any);
}
export declare class CloseEvent extends Event {
    code: number;
    reason: string;
    wasClean: boolean;
    constructor(code: number, reason: string, target: any);
}
export interface WebSocketEventMap {
    close: CloseEvent;
    error: ErrorEvent;
    message: MessageEvent;
    open: Event;
}
export declare type EventListener = (events: Event | CloseEvent | MessageEvent) => void;
