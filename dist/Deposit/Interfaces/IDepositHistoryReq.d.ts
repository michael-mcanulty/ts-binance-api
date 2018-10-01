import { Signed } from "../../index";
import { EDepositStatus } from "../EDepositStatus";
export interface IDepositHistoryReq extends Signed {
    asset: string;
    recvWindow: number;
    startTime: number;
    status: EDepositStatus;
    timestamp: number;
}
