import {EWithdrawStatus} from "../EWithdrawStatus";
import {Signed} from "../..";

export interface IWithdrawHistoryReq extends Signed{
	asset:string;
	startTime:number;
	endTime:number;
	status: EWithdrawStatus;
	recvWindow:number;
	timestamp:number;
}