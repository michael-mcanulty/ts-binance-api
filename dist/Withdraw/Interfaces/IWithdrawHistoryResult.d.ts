import { TWithdrawStatus } from "../TWithdrawStatus";
export interface WithdrawList {
    address: string;
    addressTag: string;
    amount: number;
    applyTime: any;
    asset: string;
    id: string;
    status: TWithdrawStatus;
    txId: string;
}
export interface IWithdrawHistoryResult {
    success: boolean;
    withdrawList: WithdrawList[];
}
