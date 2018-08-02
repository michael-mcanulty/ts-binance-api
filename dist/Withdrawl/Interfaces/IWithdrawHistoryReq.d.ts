import { EWithdrawlStatus } from "../EWithdrawlStatus";
import { Signed } from "../..";
export interface IWithdrawHistoryReq extends Signed {
    asset: string;
    startTime: number;
    endTime: number;
    status: EWithdrawlStatus;
    recvWindow: number;
    timestamp: number;
}
