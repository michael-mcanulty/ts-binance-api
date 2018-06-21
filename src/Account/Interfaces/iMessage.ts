export interface iMessage {
	eventTime: number;
	eventType: string;
}

export enum eEventType {
	executionReport,
	account
}