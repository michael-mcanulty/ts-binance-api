import {TWithdrawStatus} from "../TWithdrawStatus";
import {ISigned} from "../../Rest/Interfaces/ISigned";

export interface IWithdrawHistoryReq extends ISigned {
	asset: string;
	endTime: number;
	recvWindow: number;
	startTime: number;
	status: TWithdrawStatus;
	timestamp: number;
}