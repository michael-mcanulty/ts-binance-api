import {Signed} from "../Rest/Signed";
import {IAccountInfoOptions} from "./Interfaces/IAccountInfoOptions";

export class AccountInfoOptions extends Signed implements IAccountInfoOptions {
	recvWindow?: number;

	constructor(recvWindow?: number) {
		super();
		this.recvWindow = recvWindow;
	}
}