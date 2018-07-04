export interface IMessage {
	eventTime: number;
	eventType: string;
}

export enum eEventType {
	executionReport,
	account
}