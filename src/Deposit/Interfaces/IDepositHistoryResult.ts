import {EDepositStatus} from "../EDepositStatus";

export interface IDepositList {
	address: string;
	addressTag: string;
	amount: number;
	asset: string;
	insertTime: any;
	status: EDepositStatus;
	txId: string;
}

export interface IDepositHistoryResult {
	depositList: IDepositList[];
	success: boolean;
}