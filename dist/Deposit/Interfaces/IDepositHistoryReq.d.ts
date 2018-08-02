import { Signed } from "../../index";
import { EDepositStatus } from "../EDepositStatus";
export interface IDepositHistoryReq extends Signed {
    asset: string;
    status: EDepositStatus;
    startTime: number;
    recvWindow: number;
    timestamp: number;
}
