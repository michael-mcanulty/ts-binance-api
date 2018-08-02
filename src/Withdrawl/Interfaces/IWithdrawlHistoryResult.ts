import {EWithdrawlStatus} from "../EWithdrawlStatus";

export interface WithdrawList {
	id: string;
	amount: number;
	address: string;
	asset: string;
	txId: string;
	applyTime: any;
	status: EWithdrawlStatus;
	addressTag: string;
}

export interface IWithdrawlHistoryResult {
	withdrawList: WithdrawList[];
	success: boolean;
}