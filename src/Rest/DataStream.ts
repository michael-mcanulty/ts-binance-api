import {IListenKey} from "./Interfaces/IListenKey";

export class DataStream{
	listenKey: string;

	constructor(listenKey: IListenKey) {
		this.listenKey = listenKey.listenKey;
	}
}