import { EWithdrawlStatus } from "../EWithdrawlStatus";
import { Signed } from "../..";
export interface IWithdrawlHistoryReq extends Signed {
    asset: string;
    startTime: number;
    endTime: number;
    status: EWithdrawlStatus;
    recvWindow: number;
    timestamp: number;
}
