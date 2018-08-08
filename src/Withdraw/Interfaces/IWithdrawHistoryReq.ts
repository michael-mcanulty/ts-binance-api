import {EWithdrawStatus} from "../EWithdrawStatus";
import {Signed} from "../..";

export interface IWithdrawHistoryReq extends Signed {
	asset: string;
	endTime: number;
	recvWindow: number;
	startTime: number;
	status: EWithdrawStatus;
	timestamp: number;
}