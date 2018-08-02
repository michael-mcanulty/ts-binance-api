import { EDepositStatus } from "../EDepositStatus";
export interface IDepositList {
    insertTime: any;
    amount: number;
    asset: string;
    address: string;
    txId: string;
    status: EDepositStatus;
    addressTag: string;
}
export interface IDepositHistoryResult {
    depositList: IDepositList[];
    success: boolean;
}
