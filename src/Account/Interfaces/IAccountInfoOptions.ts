import {ISigned} from "../../Rest/Interfaces/ISigned";

export interface IAccountInfoOptions extends ISigned {
	recvWindow?: number;
}