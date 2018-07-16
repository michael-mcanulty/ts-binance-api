import {Signed} from "./Signed";
import {IListenKey} from "./IListenKey";

export class DataStream extends Signed {
	listenKey: string;

	constructor(listenKey: IListenKey) {
		super();
		this.listenKey = listenKey.listenKey;
	}
}