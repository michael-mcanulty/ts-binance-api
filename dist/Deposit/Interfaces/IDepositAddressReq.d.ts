import { Signed } from "../..";
import { EDepositStatus } from "../EDepositStatus";
export interface IDepositAddressReq extends Signed {
    asset: string;
    status: EDepositStatus;
    recvWindow: number;
    timestamp: number;
}
