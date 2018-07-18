import {Signed} from "../../Rest/Signed";

export interface IAccountInfoOptions extends Signed {
	recvWindow?: number;
}