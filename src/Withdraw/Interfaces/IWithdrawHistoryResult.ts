import {EWithdrawStatus} from "../EWithdrawStatus";

export interface WithdrawList {
	address: string;
	addressTag: string;
	amount: number;
	applyTime: any;
	asset: string;
	id: string;
	status: EWithdrawStatus;
	txId: string;
}

export interface IWithdrawHistoryResult {
	success: boolean;
	withdrawList: WithdrawList[];
}