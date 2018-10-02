import {ISigned} from "../../Rest/Interfaces/ISigned";
import {EDepositStatus} from "../EDepositStatus";

export interface IDepositHistoryReq extends ISigned {
	asset: string;
	recvWindow: number;
	startTime: number;
	status: EDepositStatus;
	timestamp: number;
}