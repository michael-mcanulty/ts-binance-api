import {Signed} from "../..";
import {EDepositStatus} from "../EDepositStatus";

export interface IDepositAddressReq extends Signed {
	asset: string;
	recvWindow: number;
	status: EDepositStatus;
	timestamp: number;
}