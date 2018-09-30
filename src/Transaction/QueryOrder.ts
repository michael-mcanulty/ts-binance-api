import {IQueryOrder} from "./Interfaces/IQueryOrder";
import {BaseQueryOrder} from "./BaseQueryOrder";
import {IQueryOrderOpts} from "./Interfaces/IQueryOrderOpts";

export class QueryOrder extends BaseQueryOrder implements IQueryOrder {
	origClientOrderId: string;

	constructor(opts: IQueryOrderOpts) {
		super(opts.symbol, opts.orderId, opts.recvWindow);
		this.origClientOrderId = opts.origClientOrderId;
	}
}