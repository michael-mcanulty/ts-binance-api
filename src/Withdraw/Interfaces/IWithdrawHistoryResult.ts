import {EWithdrawStatus} from "../EWithdrawStatus";

export interface WithdrawList {
	id: string;
	amount: number;
	address: string;
	asset: string;
	txId: string;
	applyTime: any;
	status: EWithdrawStatus;
	addressTag: string;
}

export interface IWithdrawHistoryResult {
	withdrawList: WithdrawList[];
	success: boolean;
}