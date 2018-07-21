import {Signed} from "./Signed";
import {IListenKey} from "./Interfaces/IListenKey";

export class DataStream extends Signed {
	listenKey: string;

	constructor(listenKey: IListenKey) {
		super();
		this.listenKey = listenKey.listenKey;
	}
}