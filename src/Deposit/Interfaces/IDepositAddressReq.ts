import {ISigned} from "../../Rest/Interfaces/ISigned";
import {EDepositStatus} from "../EDepositStatus";

export interface IDepositAddressReq extends ISigned {
	asset: string;
	recvWindow: number;
	status: EDepositStatus;
	timestamp: number;
}