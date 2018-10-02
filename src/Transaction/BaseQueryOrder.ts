import {IBaseQueryOrder} from "../Transaction/Interfaces/IBaseQueryOrder";
import {Signed} from "../Rest/Signed";

export class BaseQueryOrder extends Signed{
	orderId: number;
	recvWindow: number;
	symbol: string;

	constructor(baseQuery: IBaseQueryOrder) {
		super();
		this.symbol = baseQuery.symbol;
		this.orderId = baseQuery.orderId;
		this.recvWindow = baseQuery.recvWindow;
		this.signature = baseQuery.signature || undefined;
		this.timestamp = baseQuery.timestamp || undefined;
	}
}
