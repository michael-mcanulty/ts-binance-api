export interface IMessage {
    eventTime: number;
    eventType: string;
}
export declare enum eEventType {
    executionReport = 0,
    account = 1,
}
